
import { createClient } from "@supabase/supabase-js";

const GOOGLE_TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const GOOGLE_CALENDAR_API =
  "https://www.googleapis.com/calendar/v3";

type SyncResult = {
  status: "created" | "pending" | "not_connected" | "failed";
  message: string;
};

type GoogleEvent = {
  id?: string;
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: Array<{
      entryPointType?: string;
      uri?: string;
    }>;
    createRequest?: {
      status?: {
        statusCode?: string;
      };
    };
  };
};

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
};

type SyncInput = {
  sessionId: string;
  psychologistId: string;
};

function getMeetUrl(event: GoogleEvent): string | null {
  const videoEntry = event.conferenceData?.entryPoints?.find(
    (entry) => entry.entryPointType === "video",
  );

  const candidate = event.hangoutLink ?? videoEntry?.uri;

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

function getEventId(sessionId: string): string {
  return `tps${sessionId.replace(/-/g, "").toLowerCase()}`;
}

async function wait(milliseconds: number) {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function createGoogleCalendarEventForSession({
  sessionId,
  psychologistId,
}: SyncInput): Promise<SyncResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return {
      status: "failed",
      message: "Falta la configuración privada de Supabase.",
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
    // Verificar que la sesión pertenece al profesional.
    const { data: session, error: sessionError } =
      await admin
        .from("sessions")
        .select(
          "id, psychologist_id, starts_at, ends_at, calendar_event_id",
        )
        .eq("id", sessionId)
        .eq("psychologist_id", psychologistId)
        .maybeSingle();

    if (sessionError || !session) {
      throw new Error("La sesión no está disponible para sincronizar.");
    }

    // Buscar la conexión Google del profesional.
    const { data: connection, error: connectionError } =
      await admin
        .from("google_calendar_connections")
        .select(
          "calendar_id, access_token, refresh_token, access_token_expires_at",
        )
        .eq("profile_id", psychologistId)
        .maybeSingle();

    if (connectionError) {
      throw new Error("No fue posible consultar la conexión de Google.");
    }

    if (!connection) {
      return {
        status: "not_connected",
        message:
          "La sesión quedó guardada en TuPsico, pero este profesional aún no tiene Google Calendar conectado.",
      };
    }

    const calendarId = connection.calendar_id || "primary";
    let accessToken = connection.access_token as string | null;

    const expiresAt = connection.access_token_expires_at
      ? new Date(connection.access_token_expires_at).getTime()
      : 0;

    const tokenIsUsable =
      Boolean(accessToken) &&
      Number.isFinite(expiresAt) &&
      expiresAt > Date.now() + 60_000;

    // Renovar el token antes de llamar a Google cuando sea necesario.
    if (!tokenIsUsable) {
      const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

      if (!clientId || !clientSecret || !connection.refresh_token) {
        throw new Error(
          "Faltan las credenciales necesarias para renovar Google OAuth.",
        );
      }

      const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: connection.refresh_token,
          grant_type: "refresh_token",
        }).toString(),
        cache: "no-store",
      });

      const tokenData =
        (await tokenResponse.json()) as GoogleTokenResponse;

      if (!tokenResponse.ok || !tokenData.access_token) {
        throw new Error(
          `No fue posible renovar Google OAuth (${tokenResponse.status}).`,
        );
      }

      accessToken = tokenData.access_token;

      const newExpiration = new Date(
        Date.now() + (tokenData.expires_in ?? 3600) * 1000,
      ).toISOString();

      const { error: tokenSaveError } = await admin
        .from("google_calendar_connections")
        .update({
          access_token: accessToken,
          access_token_expires_at: newExpiration,
          updated_at: new Date().toISOString(),
        })
        .eq("profile_id", psychologistId);

      if (tokenSaveError) {
        throw new Error(
          "No fue posible guardar la renovación de Google OAuth.",
        );
      }
    }

    if (!accessToken) {
      throw new Error("No hay un token de acceso válido.");
    }

    const eventsUrl =
      `${GOOGLE_CALENDAR_API}/calendars/` +
      `${encodeURIComponent(calendarId)}/events`;

    const expectedEventId = getEventId(sessionId);

    async function getGoogleEvent(
      eventId: string,
    ): Promise<GoogleEvent> {
      const response = await fetch(
        `${eventsUrl}/${encodeURIComponent(eventId)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Google no permitió consultar el evento (${response.status}).`,
        );
      }

      return (await response.json()) as GoogleEvent;
    }

    let event: GoogleEvent;
    let eventId: string;

    if (session.calendar_event_id) {
      // Ya existe un evento vinculado: no generar otro.
      eventId = session.calendar_event_id;
      event = await getGoogleEvent(eventId);
    } else {
      // Cada sesión tendrá un ID estable para evitar duplicados.
      const response = await fetch(
        `${eventsUrl}?conferenceDataVersion=1&sendUpdates=none`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: expectedEventId,
            summary: "Cita privada - TuPsico",
            description: "Sesión privada programada desde TuPsico.",
            visibility: "private",
            start: {
              dateTime: session.starts_at,
              timeZone: "America/Bogota",
            },
            end: {
              dateTime: session.ends_at,
              timeZone: "America/Bogota",
            },
            reminders: {
              useDefault: false,
            },
            conferenceData: {
              createRequest: {
                requestId: crypto.randomUUID(),
                conferenceSolutionKey: {
                  type: "hangoutsMeet",
                },
              },
            },
          }),
          cache: "no-store",
        },
      );

      eventId = expectedEventId;

      if (response.status === 409) {
        // El evento ya existe en Google.
        event = await getGoogleEvent(eventId);
      } else if (response.ok) {
        event = (await response.json()) as GoogleEvent;
        eventId = event.id ?? expectedEventId;
      } else {
        throw new Error(
          `Google rechazó la creación del evento (${response.status}).`,
        );
      }
    }

    // Guardar primero el evento para no repetir su creación.
    const { data: storedSession, error: saveEventError } =
      await admin
        .from("sessions")
        .update({
          calendar_event_id: eventId,
        })
        .eq("id", sessionId)
        .eq("psychologist_id", psychologistId)
        .select("id")
        .maybeSingle();

    if (saveEventError || !storedSession) {
      throw new Error(
        "Google creó el evento, pero TuPsico no pudo guardar su identificador.",
      );
    }

    // Google puede tardar en generar el enlace Meet.
    let meetUrl = getMeetUrl(event);

    for (let attempt = 0; attempt < 4 && !meetUrl; attempt++) {
      const conferenceStatus =
        event.conferenceData?.createRequest?.status?.statusCode;

      if (conferenceStatus === "failure") {
        break;
      }

      await wait(700);

      event = await getGoogleEvent(eventId);
      meetUrl = getMeetUrl(event);
    }

    if (!meetUrl) {
      return {
        status: "pending",
        message:
          "La sesión y el evento de Google Calendar quedaron guardados. Google Meet aún no ha entregado el enlace.",
      };
    }

    const { data: updatedSession, error: saveMeetError } =
      await admin
        .from("sessions")
        .update({
          calendar_event_id: eventId,
          meeting_provider: "google_meet",
          meet_url: meetUrl,
        })
        .eq("id", sessionId)
        .eq("psychologist_id", psychologistId)
        .select("id")
        .maybeSingle();

    if (saveMeetError || !updatedSession) {
      throw new Error(
        "Google generó Meet, pero TuPsico no pudo guardar el enlace.",
      );
    }

    return {
      status: "created",
      message:
        "La sesión se guardó y Google Calendar generó su enlace de Meet.",
    };
  } catch (error) {
    console.error(
      "Error sincronizando sesión con Google Calendar:",
      error instanceof Error ? error.message : "Error desconocido",
    );

    return {
      status: "failed",
      message:
        "La sesión permanece registrada en TuPsico, pero no se pudo completar su sincronización con Google Calendar.",
    };
  }
}
