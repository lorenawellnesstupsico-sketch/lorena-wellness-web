"use server";

import { revalidatePath } from "next/cache";

import { requireAdministrator } from "@/lib/auth/require-administrator";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionStatus = "idle" | "success" | "error";

export type CreatePsychologistActionState = {
  status: ActionStatus;
  message: string;
  credentials?: {
    fullName: string;
    email: string;
    password: string;
  };
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const BOOLEAN_VALUES = new Set(["true", "false"]);

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

export async function createPsychologistAction(
  _previousState: CreatePsychologistActionState,
  formData: FormData,
): Promise<CreatePsychologistActionState> {
  const { user: administratorUser } =
    await requireAdministrator();

  const fullName = getText(
    formData,
    "full_name",
  );

  const email = getText(
    formData,
    "email",
  ).toLowerCase();

  const phone = getText(
    formData,
    "phone",
  );

  const password = getText(
    formData,
    "password",
  );

  const professionalTitle =
    getText(
      formData,
      "professional_title",
    ) || "Psicólogo";

  const specialty = getText(
    formData,
    "specialty",
  );

  const professionalLicenseNumber = getText(
    formData,
    "professional_license_number",
  );

  const professionalLicenseCountry =
    getText(
      formData,
      "professional_license_country",
    ) || "Colombia";

  const shortBio = getText(
    formData,
    "short_bio",
  );

  const city = getText(
    formData,
    "city",
  );

  const country =
    getText(
      formData,
      "country",
    ) || "Colombia";

  const joinedAt = getText(
    formData,
    "joined_at",
  );

  const acceptingPatientsValue =
    getText(
      formData,
      "is_accepting_patients",
    ) || "true";

  const activeValue =
    getText(
      formData,
      "is_active",
    ) || "true";

  if (fullName.length < 3 || fullName.length > 120) {
    return {
      status: "error",
      message:
        "Escribe el nombre completo del psicólogo. Debe tener entre 3 y 120 caracteres.",
    };
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return {
      status: "error",
      message:
        "Escribe un correo electrónico válido.",
    };
  }

  if (phone.length > 30) {
    return {
      status: "error",
      message:
        "El número de teléfono es demasiado largo.",
    };
  }

  if (!isValidPassword(password)) {
    return {
      status: "error",
      message:
        "La contraseña debe tener entre 10 y 72 caracteres e incluir mayúscula, minúscula, número y símbolo.",
    };
  }

  if (
    professionalTitle.length < 3 ||
    professionalTitle.length > 120
  ) {
    return {
      status: "error",
      message:
        "El título profesional debe tener entre 3 y 120 caracteres.",
    };
  }

  if (specialty.length > 180) {
    return {
      status: "error",
      message:
        "La especialidad no puede superar los 180 caracteres.",
    };
  }

  if (
    professionalLicenseNumber &&
    (
      professionalLicenseNumber.length < 3 ||
      professionalLicenseNumber.length > 80
    )
  ) {
    return {
      status: "error",
      message:
        "El número de tarjeta profesional debe tener entre 3 y 80 caracteres.",
    };
  }

  if (
    professionalLicenseCountry.length < 2 ||
    professionalLicenseCountry.length > 80
  ) {
    return {
      status: "error",
      message:
        "El país de expedición de la tarjeta profesional no es válido.",
    };
  }

  if (shortBio.length > 1500) {
    return {
      status: "error",
      message:
        "La presentación profesional no puede superar los 1.500 caracteres.",
    };
  }

  if (city.length > 120) {
    return {
      status: "error",
      message:
        "La ciudad no puede superar los 120 caracteres.",
    };
  }

  if (country.length < 2 || country.length > 80) {
    return {
      status: "error",
      message:
        "El país seleccionado no es válido.",
    };
  }

  if (joinedAt && !isValidDate(joinedAt)) {
    return {
      status: "error",
      message:
        "La fecha de incorporación no tiene un formato válido.",
    };
  }

  if (!BOOLEAN_VALUES.has(acceptingPatientsValue)) {
    return {
      status: "error",
      message:
        "El estado de recepción de pacientes no es válido.",
    };
  }

  if (!BOOLEAN_VALUES.has(activeValue)) {
    return {
      status: "error",
      message:
        "El estado de acceso del psicólogo no es válido.",
    };
  }

  const isAcceptingPatients =
    acceptingPatientsValue === "true";

  const isActive =
    activeValue === "true";

  const adminClient = createAdminClient();

  if (professionalLicenseNumber) {
    const {
      data: existingLicense,
      error: existingLicenseError,
    } = await adminClient
      .from("psychologists")
      .select("id")
      .ilike(
        "professional_license_country",
        professionalLicenseCountry,
      )
      .ilike(
        "professional_license_number",
        professionalLicenseNumber,
      )
      .maybeSingle();

    if (existingLicenseError) {
      console.error(
        "Error validating professional license:",
        existingLicenseError,
      );

      return {
        status: "error",
        message:
          "No fue posible comprobar la tarjeta profesional. Intenta nuevamente.",
      };
    }

    if (existingLicense) {
      return {
        status: "error",
        message:
          "Ya existe un psicólogo registrado con esa tarjeta profesional.",
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
      app_role: "psychologist",
    },
  });

  if (createAuthError || !createdAuthUser.user) {
    console.error(
      "Error creating psychologist authentication account:",
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
        : "No fue posible crear la cuenta del psicólogo. Revisa los datos e intenta nuevamente.",
    };
  }

  const psychologistUserId =
    createdAuthUser.user.id;

  if (!UUID_PATTERN.test(psychologistUserId)) {
    console.error(
      "Invalid psychologist user ID returned by Supabase.",
    );

    return {
      status: "error",
      message:
        "Supabase devolvió un identificador de usuario inválido.",
    };
  }

  const {
    data: updatedProfile,
    error: profileError,
  } = await adminClient
    .from("profiles")
    .update({
      full_name: fullName,
      email,
      phone: phone || null,
      role: "psychologist",
      is_active: isActive,
    })
    .eq("id", psychologistUserId)
    .select("id")
    .maybeSingle();

  if (profileError || !updatedProfile) {
    console.error(
      "Error updating psychologist profile:",
      profileError,
    );

    const { error: rollbackError } =
      await adminClient.auth.admin.deleteUser(
        psychologistUserId,
      );

    if (rollbackError) {
      console.error(
        "Error rolling back psychologist authentication user:",
        rollbackError,
      );
    }

    return {
      status: "error",
      message:
        "La cuenta no pudo completar su perfil y fue revertida. Intenta nuevamente.",
    };
  }

  const {
    error: psychologistError,
  } = await adminClient
    .from("psychologists")
    .insert({
      profile_id: psychologistUserId,
      created_by_admin_id:
        administratorUser.id,
      professional_title:
        professionalTitle,
      specialty:
        specialty || null,
      professional_license_number:
        professionalLicenseNumber || null,
      professional_license_country:
        professionalLicenseCountry,
      short_bio:
        shortBio || null,
      city:
        city || null,
      country,
      is_accepting_patients:
        isAcceptingPatients,
      joined_at:
        joinedAt || null,
    });

  if (psychologistError) {
    console.error(
      "Error creating psychologist professional record:",
      psychologistError,
    );

    const { error: rollbackError } =
      await adminClient.auth.admin.deleteUser(
        psychologistUserId,
      );

    if (rollbackError) {
      console.error(
        "Error rolling back psychologist authentication user:",
        rollbackError,
      );
    }

    const duplicateLicense =
      psychologistError.code === "23505";

    return {
      status: "error",
      message: duplicateLicense
        ? "La tarjeta profesional ya se encuentra registrada."
        : "No fue posible crear la ficha profesional. La cuenta fue revertida para evitar información incompleta.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/psicologos");
  revalidatePath("/dashboard/pacientes");

  return {
    status: "success",
    message:
      "El psicólogo fue creado correctamente. Copia las credenciales antes de cerrar este mensaje.",
    credentials: {
      fullName,
      email,
      password,
    },
  };
}