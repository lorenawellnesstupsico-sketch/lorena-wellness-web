import Link from "next/link";
import { redirect } from "next/navigation";

import { CreatePatientSessionForm } from "@/components/dashboard/create-patient-session-form";
import { EditPatientProcessForm } from "@/components/dashboard/edit-patient-process-form";
import { EditPatientSessionForm } from "@/components/dashboard/edit-patient-session-form";
import { requirePsychologist } from "@/lib/auth/require-psychologist";

type AssignedPatientDetail = {
  patient_id: string;
  profile_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  start_date: string | null;
  payment_status: string;
  access_status: string;

  plan_id: string | null;
  plan_name: string | null;
  plan_description: string | null;
  included_sessions: number | null;
  session_duration_minutes: number | null;

  process_id: string | null;
  enfoque_actual: string | null;
  objetivo_principal: string | null;
  trabajo_actual: string | null;
  siguiente_paso: string | null;
  recordatorio_terapeutico: string | null;
  process_updated_at: string | null;
};

type SessionRow = {
  session_id: string;
  patient_id: string;
  psychologist_id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status: string;
  meeting_provider: string;
  meet_url: string | null;
  calendar_event_id: string | null;
  notes_internal: string | null;
  notes_visible_to_patient: string | null;
  created_at: string;
};

function formatDateOnly(
  value: string | null,
) {
  if (!value) {
    return "Por definir";
  }

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value,
    );

  if (!match) {
    return "Por definir";
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  );

  if (Number.isNaN(date.getTime())) {
    return "Por definir";
  }

  return new Intl.DateTimeFormat(
    "es-CO",
    {
      dateStyle: "long",
      timeZone: "UTC",
    },
  ).format(date);
}

function formatDateTime(
  value: string | null,
) {
  if (!value) {
    return "Por definir";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Por definir";
  }

  return new Intl.DateTimeFormat(
    "es-CO",
    {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Bogota",
    },
  ).format(date);
}

function getBogotaParts(
  value: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "",
      time: "",
    };
  }

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    ).formatToParts(date);

  const values =
    Object.fromEntries(
      parts.map((part) => [
        part.type,
        part.value,
      ]),
    );

  return {
    date:
      `${values.year}-${values.month}-${values.day}`,

    time:
      `${values.hour}:${values.minute}`,
  };
}

function getDurationMinutes(
  startsAt: string,
  endsAt: string,
) {
  const start =
    new Date(startsAt).getTime();

  const end =
    new Date(endsAt).getTime();

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    end <= start
  ) {
    return null;
  }

  return Math.round(
    (end - start) / 60000,
  );
}

function getPaymentStatusLabel(
  status: string,
) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    partial: "Pago parcial",
    paid: "Pagado",
    overdue: "Vencido",
    canceled: "Cancelado",
  };

  return labels[status] ?? status;
}

function getAccessStatusLabel(
  status: string,
) {
  const labels: Record<string, string> = {
    invited: "Invitado",
    active: "Activo",
    inactive: "Inactivo",
    suspended: "Suspendido",
  };

  return labels[status] ?? status;
}

function getSessionStatusLabel(
  status: string,
) {
  const labels: Record<string, string> = {
    scheduled: "Programada",
    confirmed: "Confirmada",
    completed: "Realizada",
    canceled: "Cancelada",
    no_show: "No asistió",
    rescheduled: "Reprogramada",
  };

  return labels[status] ?? status;
}

function getAccessStatusClasses(
  status: string,
) {
  if (status === "active") {
    return "bg-[#E3F1E7] text-[#42664C]";
  }

  if (
    status === "inactive" ||
    status === "suspended"
  ) {
    return "bg-[#F4E3E3] text-[#8A4747]";
  }

  return "bg-[#F1E4D7] text-[#8C5A3C]";
}

function getPaymentStatusClasses(
  status: string,
) {
  if (status === "paid") {
    return "bg-[#E3F1E7] text-[#42664C]";
  }

  if (
    status === "overdue" ||
    status === "canceled"
  ) {
    return "bg-[#F4E3E3] text-[#8A4747]";
  }

  return "bg-[#F1E4D7] text-[#8C5A3C]";
}

function getSessionStatusClasses(
  status: string,
) {
  if (
    status === "scheduled" ||
    status === "confirmed" ||
    status === "rescheduled"
  ) {
    return "bg-[#EFE1EB] text-[#76516E]";
  }

  if (status === "completed") {
    return "bg-[#E3F1E7] text-[#42664C]";
  }

  if (
    status === "canceled" ||
    status === "no_show"
  ) {
    return "bg-[#F4E3E3] text-[#8A4747]";
  }

  return "bg-[#F1E4D7] text-[#8C5A3C]";
}

function InformationBlock({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E7D8C8] bg-[#FAF6F1] p-5">
      <p className="text-sm font-semibold text-[#4E3427]">
        {title}
      </p>

      <p className="mt-2 break-words text-sm leading-7 text-[#6E5648]">
        {value}
      </p>
    </div>
  );
}

export default async function AssignedPatientDetailPage({
  params,
}: {
  params: Promise<{
    patientId: string;
  }>;
}) {
  const { patientId } = await params;

  const {
    supabase,
    profile,
  } = await requirePsychologist();

  const [
    patientResult,
    sessionsResult,
  ] = await Promise.all([
    supabase.rpc(
      "get_my_assigned_patient_detail",
      {
        target_patient_id:
          patientId,
      },
    ),

    supabase.rpc(
      "get_my_assigned_patient_sessions",
      {
        target_patient_id:
          patientId,
      },
    ),
  ]);

  if (patientResult.error) {
    console.error(
      "Error loading assigned patient detail:",
      patientResult.error,
    );

    redirect(
      "/dashboard/mis-pacientes",
    );
  }

  const patient =
    (
      (patientResult.data ??
        []) as AssignedPatientDetail[]
    )[0] ?? null;

  if (!patient) {
    redirect(
      "/dashboard/mis-pacientes",
    );
  }

  if (sessionsResult.error) {
    console.error(
      "Error loading patient sessions:",
      sessionsResult.error,
    );
  }

  const sessions =
    sessionsResult.error
      ? []
      : ((sessionsResult.data ??
          []) as SessionRow[]);

  const now = Date.now();

  const upcomingSessions =
    sessions.filter((session) => {
      const activeStatuses = [
        "scheduled",
        "confirmed",
        "rescheduled",
      ];

      return (
        activeStatuses.includes(
          session.status,
        ) &&
        new Date(
          session.ends_at,
        ).getTime() >= now
      );
    });

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
                Psicólogo
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/mis-pacientes"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DED2C5] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#F6EFE8]"
            >
              Volver a mis pacientes
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DED2C5] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#F6EFE8]"
            >
              Panel principal
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
            Ficha terapéutica
          </p>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                {patient.full_name}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
                Información autorizada del paciente
                asignado a tu perfil profesional.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold ${getAccessStatusClasses(
                  patient.access_status,
                )}`}
              >
                Acceso:{" "}
                {getAccessStatusLabel(
                  patient.access_status,
                )}
              </span>

              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold ${getPaymentStatusClasses(
                  patient.payment_status,
                )}`}
              >
                Pago:{" "}
                {getPaymentStatusLabel(
                  patient.payment_status,
                )}
              </span>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
            Información general
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Datos del paciente
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InformationBlock
              title="Correo electrónico"
              value={
                patient.email ??
                "No registrado"
              }
            />

            <InformationBlock
              title="Teléfono"
              value={
                patient.phone ??
                "No registrado"
              }
            />

            <InformationBlock
              title="Fecha de nacimiento"
              value={formatDateOnly(
                patient.birth_date,
              )}
            />

            <InformationBlock
              title="Inicio del proceso"
              value={formatDateOnly(
                patient.start_date,
              )}
            />
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
            Servicio contratado
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Plan del paciente
          </h2>

          {patient.plan_id ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-2xl border border-[#DCC9D7] bg-[#F4EAF2] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#76516E]">
                  Plan actual
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                  {patient.plan_name ??
                    "Plan sin nombre"}
                </h3>

                <p className="mt-4 leading-8 text-[#6E5648]">
                  {patient.plan_description ??
                    "No hay descripción registrada para este plan."}
                </p>
              </div>

              <div className="grid gap-4">
                <InformationBlock
                  title="Sesiones incluidas"
                  value={
                    patient.included_sessions !==
                    null
                      ? String(
                          patient.included_sessions,
                        )
                      : "Por definir"
                  }
                />

                <InformationBlock
                  title="Duración por sesión"
                  value={
                    patient.session_duration_minutes !==
                    null
                      ? `${patient.session_duration_minutes} minutos`
                      : "Por definir"
                  }
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[#DCCCBD] bg-[#FAF6F1] p-7">
              <p className="font-semibold">
                No hay un plan asignado
              </p>

              <p className="mt-2 text-sm leading-7 text-[#6E5648]">
                El administrador todavía no ha
                asignado un plan de servicio a este
                paciente.
              </p>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#DCC9D7] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#76516E]">
                Proceso terapéutico
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Seguimiento y actualización
              </h2>
            </div>

            <div className="rounded-full bg-[#F4EAF2] px-4 py-2 text-xs font-semibold text-[#76516E]">
              {patient.process_id
                ? `Actualizado: ${formatDateTime(
                    patient.process_updated_at,
                  )}`
                : "Primer registro"}
            </div>
          </div>

          <EditPatientProcessForm
            patientId={
              patient.patient_id
            }
            initialValues={{
              enfoqueActual:
                patient.enfoque_actual,

              objetivoPrincipal:
                patient.objetivo_principal,

              trabajoActual:
                patient.trabajo_actual,

              siguientePaso:
                patient.siguiente_paso,

              recordatorioTerapeutico:
                patient.recordatorio_terapeutico,
            }}
          />
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#DCC9D7] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#76516E]">
                Agenda terapéutica
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Programar nueva sesión
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6E5648]">
                Registra la fecha, hora y duración
                de la próxima sesión.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F4EAF2] px-4 py-2 text-xs font-semibold text-[#76516E]">
                {sessions.length} sesión
                {sessions.length === 1
                  ? ""
                  : "es"}
              </span>

              <span className="rounded-full bg-[#E3F1E7] px-4 py-2 text-xs font-semibold text-[#42664C]">
                {upcomingSessions.length} próxima
                {upcomingSessions.length === 1
                  ? ""
                  : "s"}
              </span>
            </div>
          </div>

          <CreatePatientSessionForm
            patientId={
              patient.patient_id
            }
          />
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
              Sesiones
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Historial y próximas citas
            </h2>
          </div>

          {sessions.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#DCCCBD] bg-[#FAF6F1] p-7">
              <p className="font-semibold">
                Todavía no hay sesiones registradas
              </p>

              <p className="mt-2 text-sm leading-7 text-[#6E5648]">
                Utiliza el formulario anterior para
                programar la primera sesión de este
                paciente.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5">
              {sessions.map(
                (session) => {
                  const duration =
                    getDurationMinutes(
                      session.starts_at,
                      session.ends_at,
                    ) ?? 60;

                  const localDateTime =
                    getBogotaParts(
                      session.starts_at,
                    );

                  return (
                    <article
                      key={
                        session.session_id
                      }
                      className="rounded-[1.75rem] border border-[#E7D8C8] bg-[#FAF6F1] p-5 md:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                            Sesión
                          </p>

                          <h3 className="mt-2 text-xl font-semibold">
                            {session.title}
                          </h3>

                          <p className="mt-3 text-sm leading-7 text-[#6E5648]">
                            {formatDateTime(
                              session.starts_at,
                            )}
                          </p>

                          <p className="mt-1 text-sm text-[#6E5648]">
                            Duración:{" "}
                            {duration} minutos
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-4 py-2 text-xs font-semibold ${getSessionStatusClasses(
                            session.status,
                          )}`}
                        >
                          {getSessionStatusLabel(
                            session.status,
                          )}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 border-t border-[#E7D8C8] pt-5 md:grid-cols-2">
                        <div className="rounded-2xl border border-[#E7D8C8] bg-white p-5">
                          <p className="text-sm font-semibold">
                            🔐 Notas internas
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#6E5648]">
                            {session.notes_internal ??
                              "Sin notas internas registradas."}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#DCC9D7] bg-[#F4EAF2] p-5">
                          <p className="text-sm font-semibold">
                            👤 Visible para el paciente
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#6E5648]">
                            {session.notes_visible_to_patient ??
                              "Sin mensaje visible registrado."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3 border-t border-[#E7D8C8] pt-5">
                        {session.meet_url ? (
                          <a
                            href={
                              session.meet_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#76516E] px-5 py-2.5 text-sm font-semibold text-white"
                          >
                            Abrir Google Meet
                          </a>
                        ) : (
                          <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DCC9D7] bg-white px-4 py-2 text-xs font-semibold text-[#76516E]">
                            Google Meet pendiente
                          </span>
                        )}
                      </div>

                      <details className="mt-5 rounded-2xl border border-[#DCC9D7] bg-white">
                        <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-[#76516E]">
                          Gestionar sesión
                        </summary>

                        <div className="border-t border-[#E7D8C8] px-5 pb-5">
                          <EditPatientSessionForm
                            key={`${session.session_id}-${session.starts_at}-${session.status}`}
                            sessionId={
                              session.session_id
                            }
                            initialTitle={
                              session.title
                            }
                            initialDate={
                              localDateTime.date
                            }
                            initialTime={
                              localDateTime.time
                            }
                            initialDurationMinutes={
                              duration
                            }
                            initialStatus={
                              session.status
                            }
                            initialNotesInternal={
                              session.notes_internal
                            }
                            initialNotesVisibleToPatient={
                              session.notes_visible_to_patient
                            }
                          />
                        </div>
                      </details>
                    </article>
                  );
                },
              )}
            </div>
          )}
        </section>

        <div className="mt-8 rounded-[2rem] border border-[#DCC9D7] bg-[#F4EAF2] p-6 md:p-8">
          <p className="font-semibold">
            Información protegida
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#6E5648]">
            La plataforma valida en Supabase que
            este paciente y cada una de sus sesiones
            pertenezcan al psicólogo autenticado.
            Las notas internas permanecen separadas
            del contenido visible para el paciente.
          </p>
        </div>
      </section>
    </main>
  );
}