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

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getText(
  formData: FormData,
  field: string,
) {
  const value = formData.get(field);

  return typeof value === "string"
    ? value.trim()
    : "";
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