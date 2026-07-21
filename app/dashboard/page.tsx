import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type AppRole = "administrator" | "psychologist" | "patient";

type ProfileRow = {
  full_name: string;
  email: string | null;
  role: AppRole;
  is_active: boolean;
};

type PatientSummary = {
  patient_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  psychologist_id: string | null;
  psychologist_name: string | null;
  plan_id: string | null;
  plan_name: string | null;
  plan_description: string | null;
  included_sessions: number | null;
  session_duration_minutes: number | null;
  payment_status: string;
  access_status: string;
  start_date: string | null;
};

type PatientProcess = {
  process_id: string;
  enfoque_actual: string | null;
  objetivo_principal: string | null;
  trabajo_actual: string | null;
  siguiente_paso: string | null;
  recordatorio_terapeutico: string | null;
  updated_at: string;
};

type PatientSession = {
  session_id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status: string;
  meeting_provider: string;
  meet_url: string | null;
  notes_visible_to_patient: string | null;
  psychologist_name: string | null;
};

type PatientResource = {
  resource_id: string;
  title: string;
  description: string | null;
  resource_type: string;
  resource_url: string | null;
  content_text: string | null;
  assigned_at: string;
};

function getRoleLabel(role: AppRole) {
  const labels: Record<AppRole, string> = {
    administrator: "Administrador",
    psychologist: "Psicólogo",
    patient: "Paciente",
  };

  return labels[role];
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    invited: "Invitado",
    active: "Activo",
    inactive: "Inactivo",
    suspended: "Suspendido",
    pending: "Pendiente",
    partial: "Pago parcial",
    paid: "Pagado",
    overdue: "Vencido",
    canceled: "Cancelado",
    scheduled: "Programada",
    confirmed: "Confirmada",
    completed: "Realizada",
    no_show: "No asistió",
    rescheduled: "Reprogramada",
  };

  return labels[status] ?? status;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Por definir";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Por definir";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
  }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Por definir";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Por definir";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(date);
}

function DashboardShell({
  profile,
  children,
}: {
  profile: ProfileRow;
  children: ReactNode;
}) {
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
                {getRoleLabel(profile.role)}
              </span>
            </div>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border border-[#DED2C5] bg-white px-5 py-2.5 text-sm font-medium text-[#4E3427] transition hover:bg-[#F6EFE8]"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      {children}
    </main>
  );
}

function InactiveAccount({ profile }: { profile: ProfileRow }) {
  return (
    <DashboardShell profile={profile}>
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
        <div className="rounded-[2rem] border border-[#E3D1C4] bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
            Acceso restringido
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            Tu cuenta se encuentra inactiva
          </h1>

          <p className="mt-5 leading-8 text-[#6E5648]">
            El acceso a la plataforma debe ser revisado por el equipo
            administrativo de Lorena Wellness TuPsico.
          </p>
        </div>
      </section>
    </DashboardShell>
  );
}

function AdministratorDashboard({ profile }: { profile: ProfileRow }) {
  const modules = [
    {
      title: "Pacientes",
      description:
        "Crear perfiles, asignar psicólogos, administrar planes y controlar accesos.",
      status: "Base de datos preparada",
    },
    {
      title: "Psicólogos",
      description:
        "Incorporar profesionales, activar cuentas y organizar sus pacientes asignados.",
      status: "Próximo módulo",
    },
    {
      title: "Pagos y planes",
      description:
        "Registrar pagos, consultar estados y administrar los planes de servicio.",
      status: "Base de datos preparada",
    },
    {
      title: "Sesiones y Meet",
      description:
        "Organizar sesiones y posteriormente conectarlas con Google Calendar y Meet.",
      status: "Integración posterior",
    },
  ];

  return (
    <DashboardShell profile={profile}>
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="rounded-[2rem] border border-[#DCC9D7] bg-[linear-gradient(135deg,#FFFDFC_0%,#F3E8F0_100%)] p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#76516E]">
            Panel administrativo
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Bienvenida, {profile.full_name}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Desde este espacio se organizarán los pacientes, psicólogos,
            planes, pagos y sesiones de TuPsico.
          </p>

          <div className="mt-8 inline-flex rounded-full bg-[#76516E] px-5 py-3 text-sm font-semibold text-white">
            Rol confirmado: Administrador
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {modules.map((module) => (
            <article
              key={module.title}
              className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-7 shadow-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                {module.status}
              </p>

              <h2 className="mt-4 text-2xl font-semibold">
                {module.title}
              </h2>

              <p className="mt-4 leading-8 text-[#6E5648]">
                {module.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#F3E7DA] p-8">
          <p className="font-semibold">Cuenta administradora</p>

          <p className="mt-3 text-sm leading-7 text-[#6E5648]">
            {profile.email}
          </p>

          <p className="mt-1 text-sm leading-7 text-[#6E5648]">
            Estado: activa
          </p>
        </div>
      </section>
    </DashboardShell>
  );
}

function PsychologistDashboard({ profile }: { profile: ProfileRow }) {
  return (
    <DashboardShell profile={profile}>
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="rounded-[2rem] border border-[#DCC9D7] bg-[linear-gradient(135deg,#FFFDFC_0%,#F3E8F0_100%)] p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#76516E]">
            Espacio profesional
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Bienvenido, {profile.full_name}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Aquí podrás consultar tus pacientes asignados, actualizar sus
            procesos, organizar sesiones y asignar recursos terapéuticos.
          </p>

          <div className="mt-8 inline-flex rounded-full bg-[#76516E] px-5 py-3 text-sm font-semibold text-white">
            Rol confirmado: Psicólogo
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Pacientes asignados",
            "Procesos terapéuticos",
            "Sesiones y recursos",
          ].map((title) => (
            <article
              key={title}
              className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-7 shadow-sm"
            >
              <h2 className="text-xl font-semibold">{title}</h2>

              <p className="mt-4 leading-8 text-[#6E5648]">
                Este módulo se habilitará en la siguiente etapa de
                construcción.
              </p>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

function PatientPendingDashboard({ profile }: { profile: ProfileRow }) {
  return (
    <DashboardShell profile={profile}>
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
        <div className="rounded-[2rem] border border-[#E3D1C4] bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
            Perfil pendiente
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            Tu espacio todavía está siendo configurado
          </h1>

          <p className="mt-5 leading-8 text-[#6E5648]">
            El equipo administrativo debe asignarte un psicólogo, un plan y
            activar tu ficha de paciente antes de mostrar tu proceso.
          </p>
        </div>
      </section>
    </DashboardShell>
  );
}

async function PatientDashboard({
  profile,
  supabase,
}: {
  profile: ProfileRow;
  supabase: Awaited<ReturnType<typeof createClient>>;
}) {
  const [
    summaryResult,
    processResult,
    sessionsResult,
    resourcesResult,
  ] = await Promise.all([
    supabase.rpc("get_my_patient_summary"),
    supabase.rpc("get_my_patient_process"),
    supabase.rpc("get_my_patient_sessions"),
    supabase.rpc("get_my_patient_resources"),
  ]);

  const firstError =
    summaryResult.error ??
    processResult.error ??
    sessionsResult.error ??
    resourcesResult.error;

  if (firstError) {
    console.error("Error loading patient dashboard:", firstError);

    return (
      <DashboardShell profile={profile}>
        <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
          <div className="rounded-[2rem] border border-[#E3D1C4] bg-white p-8 shadow-sm md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
              No fue posible cargar el espacio
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Estamos organizando tu información
            </h1>

            <p className="mt-5 leading-8 text-[#6E5648]">
              Cierra sesión e inténtalo nuevamente. Si el problema continúa,
              el equipo administrativo debe revisar la configuración de tu
              perfil.
            </p>
          </div>
        </section>
      </DashboardShell>
    );
  }

  const summary =
    ((summaryResult.data ?? []) as PatientSummary[])[0] ?? null;

  const process =
    ((processResult.data ?? []) as PatientProcess[])[0] ?? null;

  const sessions =
    (sessionsResult.data ?? []) as PatientSession[];

  const resources =
    (resourcesResult.data ?? []) as PatientResource[];

  if (!summary) {
    return <PatientPendingDashboard profile={profile} />;
  }

  const upcomingSession = sessions
    .filter((session) => {
      const activeStatuses = [
        "scheduled",
        "confirmed",
        "rescheduled",
      ];

      return (
        activeStatuses.includes(session.status) &&
        new Date(session.ends_at).getTime() >= Date.now()
      );
    })
    .sort(
      (first, second) =>
        new Date(first.starts_at).getTime() -
        new Date(second.starts_at).getTime(),
    )[0];

  return (
    <DashboardShell profile={profile}>
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="rounded-[2rem] border border-[#DCC9D7] bg-[linear-gradient(135deg,#FFFDFC_0%,#F3E8F0_100%)] p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#76516E]">
            Mi espacio terapéutico
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Bienvenida, {summary.full_name}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Aquí encontrarás la información visible de tu proceso, próxima
            sesión y recursos asignados.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Próxima sesión
            </p>

            {upcomingSession ? (
              <>
                <h2 className="mt-4 text-2xl font-semibold">
                  {upcomingSession.title}
                </h2>

                <p className="mt-4 leading-8 text-[#6E5648]">
                  {formatDateTime(upcomingSession.starts_at)}
                </p>

                <p className="mt-2 text-sm text-[#6E5648]">
                  Estado: {getStatusLabel(upcomingSession.status)}
                </p>

                <p className="mt-2 text-sm text-[#6E5648]">
                  Profesional:{" "}
                  {upcomingSession.psychologist_name ??
                    summary.psychologist_name ??
                    "Por definir"}
                </p>

                {upcomingSession.meet_url ? (
                  <a
                    href={upcomingSession.meet_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex rounded-full bg-[#76516E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#66445F]"
                  >
                    Entrar a la sesión
                  </a>
                ) : (
                  <p className="mt-6 rounded-2xl bg-[#F3E7DA] p-4 text-sm leading-7 text-[#6E5648]">
                    El enlace de la sesión todavía no ha sido asignado.
                  </p>
                )}
              </>
            ) : (
              <p className="mt-4 leading-8 text-[#6E5648]">
                No tienes sesiones próximas programadas.
              </p>
            )}
          </article>

          <article className="rounded-[2rem] border border-[#E7D8C8] bg-[#F3E7DA] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Mi plan
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              {summary.plan_name ?? "Plan por definir"}
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-7 text-[#6E5648]">
              <p>
                Psicólogo:{" "}
                <span className="font-semibold text-[#4E3427]">
                  {summary.psychologist_name ?? "Por asignar"}
                </span>
              </p>

              <p>
                Sesiones incluidas:{" "}
                <span className="font-semibold text-[#4E3427]">
                  {summary.included_sessions ?? "Por definir"}
                </span>
              </p>

              <p>
                Duración:{" "}
                <span className="font-semibold text-[#4E3427]">
                  {summary.session_duration_minutes
                    ? `${summary.session_duration_minutes} minutos`
                    : "Por definir"}
                </span>
              </p>

              <p>
                Pago:{" "}
                <span className="font-semibold text-[#4E3427]">
                  {getStatusLabel(summary.payment_status)}
                </span>
              </p>

              <p>
                Inicio:{" "}
                <span className="font-semibold text-[#4E3427]">
                  {formatDate(summary.start_date)}
                </span>
              </p>
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Mi proceso
            </p>

            {process ? (
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-[#4E3427]">
                    Objetivo principal
                  </p>

                  <p className="mt-2 leading-8 text-[#6E5648]">
                    {process.objetivo_principal ?? "Pendiente por definir"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#4E3427]">
                    Trabajo actual
                  </p>

                  <p className="mt-2 leading-8 text-[#6E5648]">
                    {process.trabajo_actual ?? "Pendiente por definir"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#4E3427]">
                    Siguiente paso
                  </p>

                  <p className="mt-2 leading-8 text-[#6E5648]">
                    {process.siguiente_paso ?? "Pendiente por definir"}
                  </p>
                </div>

                {process.recordatorio_terapeutico ? (
                  <div className="rounded-2xl bg-[#F3E7DA] p-5">
                    <p className="text-sm font-semibold text-[#4E3427]">
                      Recordatorio terapéutico
                    </p>

                    <p className="mt-2 leading-7 text-[#6E5648]">
                      {process.recordatorio_terapeutico}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 leading-8 text-[#6E5648]">
                Tu psicólogo todavía no ha registrado el resumen visible de
                tu proceso.
              </p>
            )}
          </article>

          <article className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Recursos asignados
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              {resources.length} recurso
              {resources.length === 1 ? "" : "s"}
            </h2>

            {resources.length > 0 ? (
              <div className="mt-5 space-y-4">
                {resources.slice(0, 3).map((resource) => (
                  <div
                    key={resource.resource_id}
                    className="rounded-2xl border border-[#E7D8C8] bg-[#FAF6F1] p-5"
                  >
                    <p className="font-semibold">{resource.title}</p>

                    {resource.description ? (
                      <p className="mt-2 text-sm leading-7 text-[#6E5648]">
                        {resource.description}
                      </p>
                    ) : null}

                    {resource.resource_url ? (
                      <a
                        href={resource.resource_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm font-semibold text-[#76516E] underline"
                      >
                        Abrir recurso
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 leading-8 text-[#6E5648]">
                Todavía no tienes recursos asignados.
              </p>
            )}
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, email, role, is_active")
    .eq("id", user.id)
    .single();

  if (profileError || !profileData) {
    console.error("Profile error:", profileError);

    redirect("/login");
  }

  const profile = profileData as ProfileRow;

  if (!profile.is_active) {
    return <InactiveAccount profile={profile} />;
  }

  if (profile.role === "administrator") {
    return <AdministratorDashboard profile={profile} />;
  }

  if (profile.role === "psychologist") {
    return <PsychologistDashboard profile={profile} />;
  }

  return (
    <PatientDashboard
      profile={profile}
      supabase={supabase}
    />
  );
}