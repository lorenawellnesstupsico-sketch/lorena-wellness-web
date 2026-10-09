
import { createClient } from "@supabase/supabase-js";

const GOOGLE_TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const GOOGLE_CALENDAR_API =
  "https://www.googleapis.com/calendar/v3";

type SyncStatus =
  | "updated"
  | "cancelled"
  | "skipped"
  | "not_connected"
  | "not_linked"
  | "failed";

export type CalendarSyncResult = {
  status: SyncStatus;
  message: string;
};

type SyncInput = {
  sessionId: string;
  psychologistId: string;
};

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
};

type GoogleEvent = {
  id?: string;
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: Array<{
      entryPointType?: string;
      uri?: string;
    }>;
  };
};

function getMeetUrl(
  event: GoogleEvent,
): string | null {
  const videoEntry =
    event.conferenceData?.entryPoints?.find(
      (entry) =>
        entry.entryPointType === "video",
    );

  const candidate =
    event.hangoutLink ?? videoEntry?.uri;

  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(candidate);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "meet.google.com"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export async function syncGoogleCalendarSessionEvent({
  sessionId,
  psychologistId,
}: SyncInput): Promise<CalendarSyncResult> {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return {
      status: "failed",
      message:
        "Falta la configuración privada de Supabase.",
    };
  }

  const admin = createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  try {
    // Leer únicamente la sesión del profesional indicado.
    // El llamador debe obtener psychologistId
    // de la sesión autenticada del servidor.

    const {
      data: session,
      error: sessionError,
    } = await admin
      .from("sessions")
      .select(
        "id, psychologist_id, starts_at, ends_at, status, calendar_event_id, meet_url",
      )
      .eq("id", sessionId)
      .eq("psychologist_id", psychologistId)
      .maybeSingle();

    if (sessionError || !session) {
      throw new Error(
        "No se encontró la sesión correspondiente al profesional.",
      );
    }

    const activeStatuses = new Set([
      "scheduled",
      "confirmed",
      "rescheduled",
    ]);

    // No crear un evento al editar una sesión
    // que nunca estuvo vinculada a Google.

    if (!session.calendar_event_id) {
      if (session.status === "canceled") {
        return {
          status: "skipped",
          message:
            "La sesión está cancelada y no tiene un evento de Google asociado.",
        };
      }

      return {
        status: "not_linked",
        message:
          "La sesión se actualizó en TuPsico, pero no tiene un evento de Google Calendar vinculado.",
      };
    }

    // Las sesiones completadas o no asistidas
    // conservan su evento histórico.

    if (
      session.status !== "canceled" &&
      !activeStatuses.has(session.status)
    ) {
      return {
        status: "skipped",
        message:
          "La sesión se actualizó en TuPsico. Su evento histórico de Google Calendar no necesitó cambios.",
      };
    }

    const {
      data: connection,
      error: connectionError,
    } = await admin
      .from("google_calendar_connections")
      .select(
        "calendar_id, access_token, refresh_token, access_token_expires_at",
      )
      .eq("profile_id", psychologistId)
      .maybeSingle();

    if (connectionError) {
      throw new Error(
        "No fue posible consultar la conexión Google.",
      );
    }

    if (!connection) {
      return {
        status: "not_connected",
        message:
          "El profesional no tiene una conexión activa de Google Calendar registrada.",
      };
    }

    const calendarId =
      connection.calendar_id || "primary";

    let accessToken: string | null =
      connection.access_token;

    const expiresAt =
      connection.access_token_expires_at
        ? new Date(
            connection.access_token_expires_at,
          ).getTime()
        : 0;

    const tokenIsValid =
      Boolean(accessToken) &&
      Number.isFinite(expiresAt) &&
      expiresAt > Date.now() + 60_000;

    // Renovar la autorización si el token venció.

    if (!tokenIsValid) {
      const clientId =
        process.env.GOOGLE_OAUTH_CLIENT_ID;

      const clientSecret =
        process.env.GOOGLE_OAUTH_CLIENT_SECRET;

      if (
        !clientId ||
        !clientSecret ||
        !connection.refresh_token
      ) {
        throw new Error(
          "Faltan credenciales para renovar la conexión de Google.",
        );
      }

      const tokenResponse = await fetch(
        GOOGLE_TOKEN_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token:
              connection.refresh_token,
            grant_type: "refresh_token",
          }).toString(),
          cache: "no-store",
        },
      );

      const tokenData =
        (await tokenResponse.json()) as TokenResponse;

      if (
        !tokenResponse.ok ||
        !tokenData.access_token
      ) {
        throw new Error(
          `Google rechazó la renovación de la autorización (${tokenResponse.status}).`,
        );
      }

      accessToken = tokenData.access_token;

      const expiration = new Date(
        Date.now() +
          (tokenData.expires_in ?? 3600) *
            1000,
      ).toISOString();

      const { error: saveTokenError } =
        await admin
          .from("google_calendar_connections")
          .update({
            access_token: accessToken,
            access_token_expires_at:
              expiration,
            updated_at:
              new Date().toISOString(),
          })
          .eq("profile_id", psychologistId);

      if (saveTokenError) {
        throw new Error(
          "No fue posible guardar la renovación de Google.",
        );
      }
    }

    if (!accessToken) {
      throw new Error(
        "No hay un token válido para Google Calendar.",
      );
    }

    const eventUrl =
      `${GOOGLE_CALENDAR_API}/calendars/` +
      `${encodeURIComponent(calendarId)}/events/` +
      encodeURIComponent(session.calendar_event_id);

    const authorizationHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };

    // CANCELACIÓN:
    // Eliminar el evento de Google y luego retirar
    // el enlace Meet de la sesión cancelada.

    if (session.status === "canceled") {
      const deleteResponse = await fetch(
        `${eventUrl}?sendUpdates=none`,
        {
          method: "DELETE",
          headers: authorizationHeaders,
          cache: "no-store",
        },
      );

      // 404 y 410 pueden significar que el evento
      // ya no existe. La eliminación es idempotente.

      const alreadyRemoved =
        deleteResponse.status === 404 ||
        deleteResponse.status === 410;

      if (
        !deleteResponse.ok &&
        !alreadyRemoved
      ) {
        throw new Error(
          `Google no permitió cancelar el evento (${deleteResponse.status}).`,
        );
      }

      const {
        data: clearedSession,
        error: clearError,
      } = await admin
        .from("sessions")
        .update({
          calendar_event_id: null,
          meet_url: null,
        })
        .eq("id", sessionId)
        .eq("psychologist_id", psychologistId)
        .eq("status", "canceled")
        .eq(
          "calendar_event_id",
          session.calendar_event_id,
        )
        .select("id")
        .maybeSingle();

      if (clearError || !clearedSession) {
        throw new Error(
          "El evento se canceló en Google, pero TuPsico no pudo finalizar la actualización.",
        );
      }

      return {
        status: "cancelled",
        message:
          "La sesión quedó cancelada en TuPsico y el evento fue retirado de Google Calendar.",
      };
    }

    // REPROGRAMACIÓN:
    // Modificar exclusivamente fecha y hora.
    // No modificar los datos existentes de Meet.

    const updateResponse = await fetch(
      `${eventUrl}?conferenceDataVersion=1&sendUpdates=none`,
      {
        method: "PATCH",
        headers: {
          ...authorizationHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: {
            dateTime: session.starts_at,
            timeZone: "America/Bogota",
          },
          end: {
            dateTime: session.ends_at,
            timeZone: "America/Bogota",
          },
        }),
        cache: "no-store",
      },
    );

    if (!updateResponse.ok) {
      throw new Error(
        `Google no permitió actualizar el evento (${updateResponse.status}).`,
      );
    }

    const updatedEvent =
      (await updateResponse.json()) as GoogleEvent;

    // Recuperar el enlace de Meet, si Google lo
    // devuelve y todavía no estaba registrado.

    const meetUrl =
      getMeetUrl(updatedEvent);

    if (meetUrl && meetUrl !== session.meet_url) {
      const { error: saveMeetError } =
        await admin
          .from("sessions")
          .update({
            meet_url: meetUrl,
          })
          .eq("id", sessionId)
          .eq("psychologist_id", psychologistId)
          .eq(
            "calendar_event_id",
            session.calendar_event_id,
          );

      if (saveMeetError) {
        throw new Error(
          "Google actualizó el evento, pero TuPsico no pudo actualizar el enlace de Meet.",
        );
      }
    }

    return {
      status: "updated",
      message:
        "La fecha y hora del evento se sincronizaron correctamente con Google Calendar.",
    };
  } catch (error) {
    console.error(
      "Error sincronizando cambios de Google Calendar:",
      error instanceof Error
        ? error.message
        : "Error desconocido",
    );

    return {
      status: "failed",
      message:
        "La sesión fue modificada en TuPsico, pero no se pudo confirmar su actualización en Google Calendar.",
    };
  }
}
