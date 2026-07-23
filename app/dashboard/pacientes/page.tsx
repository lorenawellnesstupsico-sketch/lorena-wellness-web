import Link from "next/link";

import { CreatePatientForm } from "@/components/dashboard/create-patient-form";
import { requireAdministrator } from "@/lib/auth/require-administrator";

type ProfileRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: "administrator" | "psychologist" | "patient";
  is_active: boolean;
};

type PlanRow = {
  id: string;
  name: string;
  session_count: number;
  session_duration_minutes: number;
  price: number;
  currency: string;
  is_active: boolean;
};

type PatientRow = {
  id: string;
  profile_id: string;
  assigned_psychologist_id: string | null;
  current_plan_id: string | null;
  payment_status: string;
  access_status: string;
  birth_date: string | null;
  start_date: string | null;
  created_at: string;
};

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    partial: "Pago parcial",
    paid: "Pagado",
    overdue: "Vencido",
    canceled: "Cancelado",
    invited: "Invitado",
    active: "Activo",
    inactive: "Inactivo",
    suspended: "Suspendido",
  };

  return labels[status] ?? status;
}

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

export default async function PatientsPage() {
  const { supabase, profile } =
    await requireAdministrator();

  const [
    profilesResult,
    plansResult,
    patientsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, email, phone, role, is_active",
      )
      .in("role", ["patient", "psychologist"])
      .order("full_name"),

    supabase
      .from("service_plans")
      .select(
        "id, name, session_count, session_duration_minutes, price, currency, is_active",
      )
      .order("session_count"),

    supabase
      .from("patients")
      .select(
        "id, profile_id, assigned_psychologist_id, current_plan_id, payment_status, access_status, birth_date, start_date, created_at",
      )
      .order("created_at", {
        ascending: false,
      }),
  ]);

  const firstError =
    profilesResult.error ??
    plansResult.error ??
    patientsResult.error;

  if (firstError) {
    console.error(
      "Error loading administrator patient module:",
      firstError,
    );

    throw new Error(
      "No fue posible cargar el módulo de pacientes.",
    );
  }

  const profiles =
    (profilesResult.data ?? []) as ProfileRow[];

  const plans =
    (plansResult.data ?? []) as PlanRow[];

  const patients =
    (patientsResult.data ?? []) as PatientRow[];

  const psychologists = profiles.filter(
    (currentProfile) =>
      currentProfile.role === "psychologist" &&
      currentProfile.is_active,
  );

  const activePlans = plans.filter(
    (plan) => plan.is_active,
  );

  const profileById = new Map(
    profiles.map((currentProfile) => [
      currentProfile.id,
      currentProfile,
    ]),
  );

  const planById = new Map(
    plans.map((plan) => [plan.id, plan]),
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
            Gestión administrativa
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Pacientes
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Crea cuentas, asigna planes y psicólogos, y
            controla el estado de acceso de cada paciente.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-[#76516E] px-5 py-3 text-sm font-semibold text-white">
              {patients.length} paciente
              {patients.length === 1 ? "" : "s"}
            </span>

            <span className="rounded-full border border-[#DCC9D7] bg-white px-5 py-3 text-sm font-semibold text-[#76516E]">
              {psychologists.length} psicólogo
              {psychologists.length === 1 ? "" : "s"} activo
              {psychologists.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="mt-10">
          <CreatePatientForm
            psychologists={psychologists.map(
              (psychologist) => ({
                id: psychologist.id,
                full_name: psychologist.full_name,
                email: psychologist.email,
              }),
            )}
            plans={activePlans.map((plan) => ({
              id: plan.id,
              name: plan.name,
              session_count: plan.session_count,
              session_duration_minutes:
                plan.session_duration_minutes,
              price: plan.price,
              currency: plan.currency,
            }))}
          />
        </div>

        <section className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
                Registros actuales
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Pacientes creados
              </h2>
            </div>

            <p className="text-sm text-[#6E5648]">
              {patients.length} registro
              {patients.length === 1 ? "" : "s"}
            </p>
          </div>

          {patients.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[#DCCCBD] bg-[#FAF6F1] p-8 text-center">
              <p className="font-semibold">
                Todavía no hay pacientes creados
              </p>

              <p className="mt-2 text-sm leading-7 text-[#6E5648]">
                Utiliza el formulario superior para crear la
                primera cuenta.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5">
              {patients.map((patient) => {
                const patientProfile = profileById.get(
                  patient.profile_id,
                );

                const psychologistProfile =
                  patient.assigned_psychologist_id
                    ? profileById.get(
                        patient.assigned_psychologist_id,
                      )
                    : null;

                const plan = patient.current_plan_id
                  ? planById.get(patient.current_plan_id)
                  : null;

                return (
                  <article
                    key={patient.id}
                    className="rounded-2xl border border-[#E7D8C8] bg-[#FAF6F1] p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {patientProfile?.full_name ??
                            "Paciente sin perfil"}
                        </h3>

                        <p className="mt-2 break-all text-sm text-[#6E5648]">
                          {patientProfile?.email ??
                            "Correo no disponible"}
                        </p>

                        {patientProfile?.phone ? (
                          <p className="mt-1 text-sm text-[#6E5648]">
                            {patientProfile.phone}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#EFE1EB] px-3 py-1.5 text-xs font-semibold text-[#76516E]">
                          {getStatusLabel(
                            patient.access_status,
                          )}
                        </span>

                        <span className="rounded-full bg-[#F1E4D7] px-3 py-1.5 text-xs font-semibold text-[#8C5A3C]">
                          {getStatusLabel(
                            patient.payment_status,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-[#E7D8C8] pt-5 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="font-semibold">
                          Plan
                        </p>

                        <p className="mt-1 leading-6 text-[#6E5648]">
                          {plan?.name ?? "Sin plan"}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">
                          Psicólogo
                        </p>

                        <p className="mt-1 leading-6 text-[#6E5648]">
                          {psychologistProfile?.full_name ??
                            "Sin asignar"}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">
                          Fecha de nacimiento
                        </p>

                        <p className="mt-1 leading-6 text-[#6E5648]">
                          {formatDateOnly(
                            patient.birth_date,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">
                          Inicio del proceso
                        </p>

                        <p className="mt-1 leading-6 text-[#6E5648]">
                          {formatDateOnly(
                            patient.start_date,
                          )}
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