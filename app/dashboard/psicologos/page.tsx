import Link from "next/link";

import { CreatePsychologistForm } from "@/components/dashboard/create-psychologist-form";
import { requireAdministrator } from "@/lib/auth/require-administrator";

type ProfileRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
};

type PsychologistRow = {
  id: string;
  profile_id: string;
  professional_title: string;
  specialty: string | null;
  professional_license_number: string | null;
  professional_license_country: string;
  short_bio: string | null;
  city: string | null;
  country: string;
  is_accepting_patients: boolean;
  joined_at: string | null;
  created_at: string;
};

type PatientAssignmentRow = {
  id: string;
  assigned_psychologist_id: string | null;
};

function formatDateOnly(value: string | null) {
  if (!value) {
    return "Por definir";
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return "Por definir";
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day),
  );

  if (Number.isNaN(date.getTime())) {
    return "Por definir";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export default async function PsychologistsPage() {
  const { supabase, profile } =
    await requireAdministrator();

  const [
    profilesResult,
    psychologistsResult,
    patientsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, email, phone, is_active",
      )
      .eq("role", "psychologist")
      .order("full_name"),

    supabase
      .from("psychologists")
      .select(
        "id, profile_id, professional_title, specialty, professional_license_number, professional_license_country, short_bio, city, country, is_accepting_patients, joined_at, created_at",
      )
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("patients")
      .select(
        "id, assigned_psychologist_id",
      ),
  ]);

  const firstError =
    profilesResult.error ??
    psychologistsResult.error ??
    patientsResult.error;

  if (firstError) {
    console.error(
      "Error loading administrator psychologist module:",
      firstError,
    );

    throw new Error(
      "No fue posible cargar el módulo de psicólogos.",
    );
  }

  const profiles =
    (profilesResult.data ?? []) as ProfileRow[];

  const psychologists =
    (psychologistsResult.data ??
      []) as PsychologistRow[];

  const patientAssignments =
    (patientsResult.data ??
      []) as PatientAssignmentRow[];

  const profileById = new Map(
    profiles.map((currentProfile) => [
      currentProfile.id,
      currentProfile,
    ]),
  );

  const assignedPatientCountByPsychologist =
    new Map<string, number>();

  for (const patient of patientAssignments) {
    if (!patient.assigned_psychologist_id) {
      continue;
    }

    const currentCount =
      assignedPatientCountByPsychologist.get(
        patient.assigned_psychologist_id,
      ) ?? 0;

    assignedPatientCountByPsychologist.set(
      patient.assigned_psychologist_id,
      currentCount + 1,
    );
  }

  const activePsychologists =
    psychologists.filter((psychologist) => {
      const psychologistProfile =
        profileById.get(psychologist.profile_id);

      return psychologistProfile?.is_active === true;
    });

  const availablePsychologists =
    activePsychologists.filter(
      (psychologist) =>
        psychologist.is_accepting_patients,
    );

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <header className="border-b border-[#E6D8CB] bg-[#FFFDFC]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
              Lorena Wellness TuPsico
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-sm text-[#6E5648]">
                {profile.full_name}
              </p>

              <span className="rounded-full bg-[#EFE1EB] px-3 py-1 text-xs font-semibold text-[#76516E]">
                Administrador
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DED2C5] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#F6EFE8]"
            >
              Volver al panel
            </Link>

            <form
              action="/auth/signout"
              method="post"
            >
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DED2C5] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#F6EFE8]"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="rounded-[2rem] border border-[#DCC9D7] bg-[linear-gradient(135deg,#FFFDFC_0%,#F3E8F0_100%)] p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#76516E]">
            Talento humano
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Psicólogos
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Registra profesionales, administra su acceso y
            consulta la cantidad de pacientes asignados a
            cada integrante del equipo.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-[#76516E] px-5 py-3 text-sm font-semibold text-white">
              {psychologists.length} profesional
              {psychologists.length === 1 ? "" : "es"}
            </span>

            <span className="rounded-full border border-[#DCC9D7] bg-white px-5 py-3 text-sm font-semibold text-[#76516E]">
              {activePsychologists.length} cuenta
              {activePsychologists.length === 1
                ? ""
                : "s"}{" "}
              activa
              {activePsychologists.length === 1 ? "" : "s"}
            </span>

            <span className="rounded-full border border-[#DCC9D7] bg-white px-5 py-3 text-sm font-semibold text-[#76516E]">
              {availablePsychologists.length} con
              disponibilidad
            </span>
          </div>
        </div>

        <div className="mt-10">
          <CreatePsychologistForm />
        </div>

        <section className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
                Equipo profesional
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Psicólogos registrados
              </h2>
            </div>

            <p className="text-sm text-[#6E5648]">
              {psychologists.length} registro
              {psychologists.length === 1 ? "" : "s"}
            </p>
          </div>

          {psychologists.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[#DCCCBD] bg-[#FAF6F1] p-8 text-center">
              <p className="font-semibold">
                Todavía no hay psicólogos creados
              </p>

              <p className="mt-2 text-sm leading-7 text-[#6E5648]">
                Utiliza el formulario superior para
                registrar el primer profesional de TuPsico.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5">
              {psychologists.map((psychologist) => {
                const psychologistProfile =
                  profileById.get(
                    psychologist.profile_id,
                  );

                const assignedPatients =
                  assignedPatientCountByPsychologist.get(
                    psychologist.profile_id,
                  ) ?? 0;

                const location = [
                  psychologist.city,
                  psychologist.country,
                ]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <article
                    key={psychologist.id}
                    className="rounded-2xl border border-[#E7D8C8] bg-[#FAF6F1] p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8C5A3C]">
                          {
                            psychologist.professional_title
                          }
                        </p>

                        <h3 className="mt-2 text-xl font-semibold">
                          {psychologistProfile?.full_name ??
                            "Profesional sin perfil"}
                        </h3>

                        <p className="mt-2 break-all text-sm text-[#6E5648]">
                          {psychologistProfile?.email ??
                            "Correo no disponible"}
                        </p>

                        {psychologistProfile?.phone ? (
                          <p className="mt-1 text-sm text-[#6E5648]">
                            {psychologistProfile.phone}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={
                            psychologistProfile?.is_active
                              ? "rounded-full bg-[#E3F1E7] px-3 py-1.5 text-xs font-semibold text-[#42664C]"
                              : "rounded-full bg-[#F4E3E3] px-3 py-1.5 text-xs font-semibold text-[#8A4747]"
                          }
                        >
                          {psychologistProfile?.is_active
                            ? "Cuenta activa"
                            : "Cuenta inactiva"}
                        </span>

                        <span
                          className={
                            psychologist.is_accepting_patients
                              ? "rounded-full bg-[#EFE1EB] px-3 py-1.5 text-xs font-semibold text-[#76516E]"
                              : "rounded-full bg-[#F1E4D7] px-3 py-1.5 text-xs font-semibold text-[#8C5A3C]"
                          }
                        >
                          {psychologist.is_accepting_patients
                            ? "Aceptando pacientes"
                            : "Sin disponibilidad"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-[#E7D8C8] pt-5 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="font-semibold">
                          Especialidad
                        </p>

                        <p className="mt-1 leading-6 text-[#6E5648]">
                          {psychologist.specialty ??
                            "Por definir"}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">
                          Tarjeta profesional
                        </p>

                        <p className="mt-1 leading-6 text-[#6E5648]">
                          {psychologist.professional_license_number
                            ? `${psychologist.professional_license_number} · ${psychologist.professional_license_country}`
                            : "Pendiente de registro"}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">
                          Incorporación
                        </p>

                        <p className="mt-1 leading-6 text-[#6E5648]">
                          {formatDateOnly(
                            psychologist.joined_at,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">
                          Pacientes asignados
                        </p>

                        <p className="mt-1 leading-6 text-[#6E5648]">
                          {assignedPatients} paciente
                          {assignedPatients === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-[#E7D8C8] pt-5 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold">
                          Ubicación
                        </p>

                        <p className="mt-1 text-sm leading-6 text-[#6E5648]">
                          {location || "Por definir"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Presentación profesional
                        </p>

                        <p className="mt-1 text-sm leading-7 text-[#6E5648]">
                          {psychologist.short_bio ??
                            "Todavía no se ha registrado una presentación profesional."}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}