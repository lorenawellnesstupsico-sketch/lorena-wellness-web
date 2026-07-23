"use server";

import { revalidatePath } from "next/cache";

import { requireAdministrator } from "@/lib/auth/require-administrator";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionStatus = "idle" | "success" | "error";

export type CreatePatientActionState = {
  status: ActionStatus;
  message: string;
  credentials?: {
    fullName: string;
    email: string;
    password: string;
  };
};

const PAYMENT_STATUSES = new Set([
  "pending",
  "partial",
  "paid",
  "overdue",
  "canceled",
]);

const ACCESS_STATUSES = new Set([
  "invited",
  "active",
  "inactive",
  "suspended",
]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function getText(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function isValidPassword(password: string) {
  if (password.length < 10 || password.length > 72) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  return (
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSymbol
  );
}

function isValidDate(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split("-");

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export async function createPatientAction(
  _previousState: CreatePatientActionState,
  formData: FormData,
): Promise<CreatePatientActionState> {
  const { user: administratorUser } =
    await requireAdministrator();

  const fullName = getText(formData, "full_name");
  const email = getText(formData, "email").toLowerCase();
  const phone = getText(formData, "phone");
  const password = getText(formData, "password");

  const psychologistId = getText(
    formData,
    "assigned_psychologist_id",
  );

  const planId = getText(
    formData,
    "current_plan_id",
  );

  const paymentStatus =
    getText(formData, "payment_status") || "pending";

  const accessStatus =
    getText(formData, "access_status") || "active";

  const birthDate = getText(formData, "birth_date");
  const startDate = getText(formData, "start_date");

  if (fullName.length < 3 || fullName.length > 120) {
    return {
      status: "error",
      message:
        "Escribe el nombre completo del paciente. Debe tener entre 3 y 120 caracteres.",
    };
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return {
      status: "error",
      message: "Escribe un correo electrónico válido.",
    };
  }

  if (phone.length > 30) {
    return {
      status: "error",
      message: "El número de teléfono es demasiado largo.",
    };
  }

  if (!isValidPassword(password)) {
    return {
      status: "error",
      message:
        "La contraseña debe tener entre 10 y 72 caracteres e incluir mayúscula, minúscula, número y símbolo.",
    };
  }

  if (!planId || !UUID_PATTERN.test(planId)) {
    return {
      status: "error",
      message:
        "Selecciona un plan válido para el paciente.",
    };
  }

  if (
    psychologistId &&
    !UUID_PATTERN.test(psychologistId)
  ) {
    return {
      status: "error",
      message:
        "El psicólogo seleccionado no es válido.",
    };
  }

  if (!PAYMENT_STATUSES.has(paymentStatus)) {
    return {
      status: "error",
      message:
        "El estado de pago seleccionado no es válido.",
    };
  }

  if (!ACCESS_STATUSES.has(accessStatus)) {
    return {
      status: "error",
      message:
        "El estado de acceso seleccionado no es válido.",
    };
  }

  if (birthDate && !isValidDate(birthDate)) {
    return {
      status: "error",
      message:
        "La fecha de nacimiento no tiene un formato válido.",
    };
  }

  if (startDate && !isValidDate(startDate)) {
    return {
      status: "error",
      message:
        "La fecha de inicio del proceso no tiene un formato válido.",
    };
  }

  if (
    birthDate &&
    startDate &&
    birthDate > startDate
  ) {
    return {
      status: "error",
      message:
        "La fecha de nacimiento no puede ser posterior a la fecha de inicio del proceso.",
    };
  }

  const adminClient = createAdminClient();

  const { data: selectedPlan, error: planError } =
    await adminClient
      .from("service_plans")
      .select("id")
      .eq("id", planId)
      .eq("is_active", true)
      .maybeSingle();

  if (planError) {
    console.error(
      "Error validating service plan:",
      planError,
    );

    return {
      status: "error",
      message:
        "No fue posible comprobar el plan seleccionado. Intenta nuevamente.",
    };
  }

  if (!selectedPlan) {
    return {
      status: "error",
      message:
        "El plan seleccionado no existe o se encuentra inactivo.",
    };
  }

  if (psychologistId) {
    const {
      data: selectedPsychologist,
      error: psychologistError,
    } = await adminClient
      .from("profiles")
      .select("id, role, is_active")
      .eq("id", psychologistId)
      .maybeSingle();

    if (psychologistError) {
      console.error(
        "Error validating psychologist:",
        psychologistError,
      );

      return {
        status: "error",
        message:
          "No fue posible comprobar el psicólogo seleccionado.",
      };
    }

    if (
      !selectedPsychologist ||
      selectedPsychologist.role !== "psychologist" ||
      !selectedPsychologist.is_active
    ) {
      return {
        status: "error",
        message:
          "El profesional seleccionado no existe o no tiene una cuenta activa de psicólogo.",
      };
    }
  }

  const {
    data: createdAuthUser,
    error: createAuthError,
  } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (createAuthError || !createdAuthUser.user) {
    console.error(
      "Error creating patient authentication account:",
      createAuthError,
    );

    const errorMessage =
      createAuthError?.message.toLowerCase() ?? "";

    const duplicateEmail =
      errorMessage.includes("already") ||
      errorMessage.includes("registered") ||
      errorMessage.includes("exists");

    return {
      status: "error",
      message: duplicateEmail
        ? "Ya existe una cuenta registrada con ese correo."
        : "No fue posible crear la cuenta del paciente. Revisa los datos e intenta nuevamente.",
    };
  }

  const patientUserId = createdAuthUser.user.id;

  const { error: profileError } = await adminClient
    .from("profiles")
    .update({
      full_name: fullName,
      email,
      phone: phone || null,
      role: "patient",
      is_active:
        accessStatus !== "inactive" &&
        accessStatus !== "suspended",
    })
    .eq("id", patientUserId);

  if (profileError) {
    console.error(
      "Error updating patient profile:",
      profileError,
    );

    const { error: rollbackError } =
      await adminClient.auth.admin.deleteUser(
        patientUserId,
      );

    if (rollbackError) {
      console.error(
        "Error rolling back authentication user:",
        rollbackError,
      );
    }

    return {
      status: "error",
      message:
        "La cuenta no pudo completar su perfil y fue revertida. Intenta nuevamente.",
    };
  }

  const { error: patientError } = await adminClient
    .from("patients")
    .insert({
      profile_id: patientUserId,
      assigned_psychologist_id:
        psychologistId || null,
      created_by_admin_id: administratorUser.id,
      current_plan_id: planId,
      payment_status: paymentStatus,
      access_status: accessStatus,
      birth_date: birthDate || null,
      start_date: startDate || null,
    });

  if (patientError) {
    console.error(
      "Error creating patient record:",
      patientError,
    );

    const { error: rollbackError } =
      await adminClient.auth.admin.deleteUser(
        patientUserId,
      );

    if (rollbackError) {
      console.error(
        "Error rolling back authentication user:",
        rollbackError,
      );
    }

    return {
      status: "error",
      message:
        "No fue posible crear la ficha del paciente. La cuenta fue revertida para evitar información incompleta.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pacientes");

  return {
    status: "success",
    message:
      "El paciente fue creado correctamente. Copia las credenciales antes de cerrar este mensaje.",
    credentials: {
      fullName,
      email,
      password,
    },
  };
}