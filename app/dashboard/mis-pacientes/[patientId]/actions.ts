
"use server";

import { revalidatePath } from "next/cache";

import { requirePsychologist } from "@/lib/auth/require-psychologist";
import { createGoogleCalendarEventForSession } from "@/lib/google-calendar/create-session-event";

type ActionStatus =
  | "idle"
  | "success"
  | "error";

export type SavePatientProcessActionState = {
  status: ActionStatus;
  message: string;
};

export type CreatePatientSessionActionState = {
  status: ActionStatus;
  message: string;
};

export type UpdatePatientSessionActionState = {
  status: ActionStatus;
  message: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}$/;

const TIME_PATTERN =
  /^([01]\d|2[0-3]):[0-5]\d$/;

const SESSION_STATUSES = new Set([
  "scheduled",
  "confirmed",
  "completed",
  "canceled",
  "no_show",
  "rescheduled",
]);

function getText(
  formData: FormData,
  field: string,
): string {
  const value = formData.get(field);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] =
    value.split("-");

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const date = new Date(
    Date.UTC(year, month - 1, day),
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function buildBogotaDateTime(
  date: string,
  time: string,
): Date {
  return new Date(
    `${date}T${time}:00-05:00`,
  );
}

function revalidatePatientPaths(
  patientId: string,
): void {
  revalidatePath(
    `/dashboard/mis-pacientes/${patientId}`,
  );

  revalidatePath(
    "/dashboard/mis-pacientes",
  );

  revalidatePath(
    "/dashboard",
  );
}

function getCreatedSessionId(
  data: unknown,
): string | null {
  const firstRow = Array.isArray(data)
    ? data[0]
    : data;

  if (
    !firstRow ||
    typeof firstRow !== "object"
  ) {
    return null;
  }

  const row = firstRow as Record<
    string,
    unknown
  >;

  const possibleId =
    typeof row.session_id === "string"
      ? row.session_id
      : typeof row.id === "string"
        ? row.id
        : null;

  return possibleId &&
    UUID_PATTERN.test(possibleId)
    ? possibleId
    : null;
}

// ============================================================
// GUARDAR PROCESO TERAPÉUTICO
// ============================================================

export async function savePatientProcessAction(
  _previousState: SavePatientProcessActionState,
  formData: FormData,
): Promise<SavePatientProcessActionState> {
  const {
    supabase,
  } = await requirePsychologist();

  const patientId = getText(
    formData,
    "patient_id",
  );

  const enfoqueActual = getText(
    formData,
    "enfoque_actual",
  );

  const objetivoPrincipal = getText(
    formData,
    "objetivo_principal",
  );

  const trabajoActual = getText(
    formData,
    "trabajo_actual",
  );

  const siguientePaso = getText(
    formData,
    "siguiente_paso",
  );

  const recordatorioTerapeutico = getText(
    formData,
    "recordatorio_terapeutico",
  );

  if (!UUID_PATTERN.test(patientId)) {
    return {
      status: "error",
      message:
        "El identificador del paciente no es válido.",
    };
  }

  if (enfoqueActual.length > 3000) {
    return {
      status: "error",
      message:
        "El enfoque actual no puede superar los 3.000 caracteres.",
    };
  }

  if (objetivoPrincipal.length > 3000) {
    return {
      status: "error",
      message:
        "El objetivo principal no puede superar los 3.000 caracteres.",
    };
  }

  if (trabajoActual.length > 5000) {
    return {
      status: "error",
      message:
        "El trabajo actual no puede superar los 5.000 caracteres.",
    };
  }

  if (siguientePaso.length > 3000) {
    return {
      status: "error",
      message:
        "El siguiente paso no puede superar los 3.000 caracteres.",
    };
  }

  if (
    recordatorioTerapeutico.length > 3000
  ) {
    return {
      status: "error",
      message:
        "El recordatorio terapéutico no puede superar los 3.000 caracteres.",
    };
  }

  if (
    !enfoqueActual &&
    !objetivoPrincipal &&
    !trabajoActual &&
    !siguientePaso &&
    !recordatorioTerapeutico
  ) {
    return {
      status: "error",
      message:
        "Registra al menos un campo del proceso terapéutico antes de guardar.",
    };
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "save_my_assigned_patient_process",
    {
      target_patient_id:
        patientId,

      new_enfoque_actual:
        enfoqueActual,

      new_objetivo_principal:
        objetivoPrincipal,

      new_trabajo_actual:
        trabajoActual,

      new_siguiente_paso:
        siguientePaso,

      new_recordatorio_terapeutico:
        recordatorioTerapeutico,
    },
  );

  if (error) {
    console.error(
      "Error saving patient process:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible guardar el proceso terapéutico. Verifica la información e intenta nuevamente.",
    };
  }

  if (
    !data ||
    (Array.isArray(data) &&
      data.length === 0)
  ) {
    return {
      status: "error",
      message:
        "Supabase no confirmó el registro del proceso terapéutico.",
    };
  }

  revalidatePatientPaths(patientId);

  return {
    status: "success",
    message:
      "Proceso terapéutico actualizado correctamente.",
  };
}

// ============================================================
// CREAR SESIÓN Y SINCRONIZAR CON GOOGLE CALENDAR
// ============================================================

export async function createPatientSessionAction(
  _previousState: CreatePatientSessionActionState,
  formData: FormData,
): Promise<CreatePatientSessionActionState> {
  const {
    supabase,
    user,
  } = await requirePsychologist();

  const patientId = getText(
    formData,
    "patient_id",
  );

  const title = getText(
    formData,
    "title",
  );

  const sessionDate = getText(
    formData,
    "session_date",
  );

  const sessionTime = getText(
    formData,
    "session_time",
  );

  const durationValue = getText(
    formData,
    "duration_minutes",
  );

  const notesInternal = getText(
    formData,
    "notes_internal",
  );

  const notesVisibleToPatient = getText(
    formData,
    "notes_visible_to_patient",
  );

  if (!UUID_PATTERN.test(patientId)) {
    return {
      status: "error",
      message:
        "El identificador del paciente no es válido.",
    };
  }

  if (
    title.length < 3 ||
    title.length > 200
  ) {
    return {
      status: "error",
      message:
        "El título de la sesión debe tener entre 3 y 200 caracteres.",
    };
  }

  if (!isValidDate(sessionDate)) {
    return {
      status: "error",
      message:
        "Selecciona una fecha válida.",
    };
  }

  if (!TIME_PATTERN.test(sessionTime)) {
    return {
      status: "error",
      message:
        "Selecciona una hora válida.",
    };
  }

  const durationMinutes =
    Number(durationValue);

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes < 15 ||
    durationMinutes > 240
  ) {
    return {
      status: "error",
      message:
        "La duración debe estar entre 15 minutos y 4 horas.",
    };
  }

  if (notesInternal.length > 10000) {
    return {
      status: "error",
      message:
        "Las notas internas no pueden superar los 10.000 caracteres.",
    };
  }

  if (
    notesVisibleToPatient.length >
    5000
  ) {
    return {
      status: "error",
      message:
        "El mensaje visible para el paciente no puede superar los 5.000 caracteres.",
    };
  }

  const startsAt =
    buildBogotaDateTime(
      sessionDate,
      sessionTime,
    );

  if (
    Number.isNaN(startsAt.getTime())
  ) {
    return {
      status: "error",
      message:
        "No fue posible interpretar la fecha y hora seleccionadas.",
    };
  }

  if (
    startsAt.getTime() <= Date.now()
  ) {
    return {
      status: "error",
      message:
        "La sesión debe programarse para una fecha y hora futuras.",
    };
  }

  const endsAt = new Date(
    startsAt.getTime() +
      durationMinutes * 60 * 1000,
  );

  // 1. Guardar primero la sesión en Supabase.
  // El RPC comprueba que el paciente esté asignado
  // al psicólogo autenticado.

  const {
    data,
    error,
  } = await supabase.rpc(
    "create_my_assigned_patient_session",
    {
      target_patient_id:
        patientId,

      new_title:
        title,

      new_starts_at:
        startsAt.toISOString(),

      new_ends_at:
        endsAt.toISOString(),

      new_notes_internal:
        notesInternal,

      new_notes_visible_to_patient:
        notesVisibleToPatient,
    },
  );

  if (error) {
    console.error(
      "Error creating patient session:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible programar la sesión. Verifica los datos e intenta nuevamente.",
    };
  }

  if (
    !data ||
    (Array.isArray(data) &&
      data.length === 0)
  ) {
    return {
      status: "error",
      message:
        "Supabase no confirmó la creación de la sesión.",
    };
  }

  // La sesión ya existe desde este momento.
  // Nunca debemos crearla nuevamente solo porque
  // falle la conexión con Google.

  const sessionId =
    getCreatedSessionId(data);

  if (!sessionId) {
    console.error(
      "El RPC creó una sesión sin devolver un ID reconocible.",
    );

    revalidatePatientPaths(patientId);

    return {
      status: "success",
      message:
        "La sesión quedó registrada en TuPsico, pero no fue posible identificarla para generar Google Meet. Revisa el historial antes de intentar programarla nuevamente.",
    };
  }

  // 2. Intentar crear el evento y solicitar Meet.
  // La función utiliza las credenciales privadas
  // guardadas en el servidor.

  const googleResult =
    await createGoogleCalendarEventForSession({
      sessionId,
      psychologistId:
        user.id,
    });

  // 3. Actualizar la vista del psicólogo y del paciente.

  revalidatePatientPaths(patientId);

  // 4. Informar el resultado real de Google.

  if (googleResult.status === "created") {
    return {
      status: "success",
      message:
        "Sesión programada correctamente. Google Calendar creó el evento y generó el enlace de Google Meet.",
    };
  }

  if (googleResult.status === "pending") {
    return {
      status: "success",
      message:
        "La sesión quedó programada y el evento se creó en Google Calendar. El enlace de Google Meet todavía está pendiente. No programes otra sesión duplicada.",
    };
  }

  if (
    googleResult.status ===
    "not_connected"
  ) {
    return {
      status: "success",
      message:
        "La sesión quedó programada en TuPsico. El profesional aún no tiene Google Calendar conectado, por lo que no se generó un enlace Meet.",
    };
  }

  return {
    status: "success",
    message:
      "La sesión quedó programada en TuPsico, pero hubo un problema al sincronizarla con Google Calendar. Revisa el historial antes de intentar crear otra cita.",
  };
}

// ============================================================
// ACTUALIZAR UNA SESIÓN EXISTENTE
// ============================================================

export async function updatePatientSessionAction(
  _previousState: UpdatePatientSessionActionState,
  formData: FormData,
): Promise<UpdatePatientSessionActionState> {
  const {
    supabase,
  } = await requirePsychologist();

  const sessionId = getText(
    formData,
    "session_id",
  );

  const title = getText(
    formData,
    "title",
  );

  const sessionDate = getText(
    formData,
    "session_date",
  );

  const sessionTime = getText(
    formData,
    "session_time",
  );

  const durationValue = getText(
    formData,
    "duration_minutes",
  );

  const status = getText(
    formData,
    "status",
  );

  const notesInternal = getText(
    formData,
    "notes_internal",
  );

  const notesVisibleToPatient = getText(
    formData,
    "notes_visible_to_patient",
  );

  if (!UUID_PATTERN.test(sessionId)) {
    return {
      status: "error",
      message:
        "El identificador de la sesión no es válido.",
    };
  }

  if (
    title.length < 3 ||
    title.length > 200
  ) {
    return {
      status: "error",
      message:
        "El título de la sesión debe tener entre 3 y 200 caracteres.",
    };
  }

  if (!isValidDate(sessionDate)) {
    return {
      status: "error",
      message:
        "Selecciona una fecha válida.",
    };
  }

  if (!TIME_PATTERN.test(sessionTime)) {
    return {
      status: "error",
      message:
        "Selecciona una hora válida.",
    };
  }

  const durationMinutes =
    Number(durationValue);

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes < 15 ||
    durationMinutes > 240
  ) {
    return {
      status: "error",
      message:
        "La duración debe estar entre 15 minutos y 4 horas.",
    };
  }

  if (!SESSION_STATUSES.has(status)) {
    return {
      status: "error",
      message:
        "El estado seleccionado no es válido.",
    };
  }

  if (notesInternal.length > 10000) {
    return {
      status: "error",
      message:
        "Las notas internas no pueden superar los 10.000 caracteres.",
    };
  }

  if (
    notesVisibleToPatient.length >
    5000
  ) {
    return {
      status: "error",
      message:
        "El mensaje visible para el paciente no puede superar los 5.000 caracteres.",
    };
  }

  const startsAt =
    buildBogotaDateTime(
      sessionDate,
      sessionTime,
    );

  if (
    Number.isNaN(startsAt.getTime())
  ) {
    return {
      status: "error",
      message:
        "No fue posible interpretar la fecha y hora seleccionadas.",
    };
  }

  const endsAt = new Date(
    startsAt.getTime() +
      durationMinutes * 60 * 1000,
  );

  const {
    data,
    error,
  } = await supabase.rpc(
    "update_my_assigned_patient_session",
    {
      target_session_id:
        sessionId,

      new_title:
        title,

      new_starts_at:
        startsAt.toISOString(),

      new_ends_at:
        endsAt.toISOString(),

      new_status:
        status,

      new_notes_internal:
        notesInternal,

      new_notes_visible_to_patient:
        notesVisibleToPatient,
    },
  );

  if (error) {
    console.error(
      "Error updating patient session:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible actualizar la sesión. Verifica la información e intenta nuevamente.",
    };
  }

  if (
    !data ||
    (Array.isArray(data) &&
      data.length === 0)
  ) {
    return {
      status: "error",
      message:
        "Supabase no confirmó la actualización de la sesión.",
    };
  }

  const updatedSession =
    (Array.isArray(data)
      ? data[0]
      : data) as {
        patient_id?: string;
      };

  if (
    updatedSession?.patient_id &&
    UUID_PATTERN.test(
      updatedSession.patient_id,
    )
  ) {
    revalidatePatientPaths(
      updatedSession.patient_id,
    );
  } else {
    revalidatePath(
      "/dashboard/mis-pacientes",
    );

    revalidatePath(
      "/dashboard",
    );
  }

  return {
    status: "success",
    message:
      "Sesión actualizada correctamente en TuPsico. Si tiene un evento de Google Calendar asociado, sus cambios todavía no se sincronizan con Google.",
  };
}
