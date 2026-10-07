"use server";

import { revalidatePath } from "next/cache";

import { requirePsychologist } from "@/lib/auth/require-psychologist";

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

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}$/;

const TIME_PATTERN =
  /^([01]\d|2[0-3]):[0-5]\d$/;

function getText(
  formData: FormData,
  field: string,
) {
  const value = formData.get(field);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function isValidDate(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [
    yearText,
    monthText,
    dayText,
  ] = value.split("-");

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

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
      target_patient_id: patientId,
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

  if (!data || data.length === 0) {
    return {
      status: "error",
      message:
        "Supabase no confirmó el registro del proceso terapéutico.",
    };
  }

  revalidatePath(
    `/dashboard/mis-pacientes/${patientId}`,
  );

  revalidatePath(
    "/dashboard/mis-pacientes",
  );

  revalidatePath(
    "/dashboard",
  );

  return {
    status: "success",
    message:
      "Proceso terapéutico actualizado correctamente.",
  };
}

export async function createPatientSessionAction(
  _previousState: CreatePatientSessionActionState,
  formData: FormData,
): Promise<CreatePatientSessionActionState> {
  const {
    supabase,
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

  const notesVisibleToPatient =
    getText(
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

  /*
   * Primera versión de agenda:
   * utilizamos explícitamente hora Colombia UTC-5.
   *
   * Cuando integremos Google Calendar,
   * centralizaremos también el manejo
   * completo de zonas horarias.
   */
  const startsAt = new Date(
    `${sessionDate}T${sessionTime}:00-05:00`,
  );

  if (
    Number.isNaN(
      startsAt.getTime(),
    )
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

  const {
    data,
    error,
  } = await supabase.rpc(
    "create_my_assigned_patient_session",
    {
      target_patient_id: patientId,
      new_title: title,
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

  if (!data || data.length === 0) {
    return {
      status: "error",
      message:
        "Supabase no confirmó la creación de la sesión.",
    };
  }

  revalidatePath(
    `/dashboard/mis-pacientes/${patientId}`,
  );

  revalidatePath(
    "/dashboard/mis-pacientes",
  );

  revalidatePath(
    "/dashboard",
  );

  return {
    status: "success",
    message:
      "Sesión programada correctamente.",
  };
}