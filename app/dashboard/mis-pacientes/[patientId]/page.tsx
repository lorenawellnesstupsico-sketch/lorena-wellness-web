import Link from "next/link";
import { redirect } from "next/navigation";

import { EditPatientProcessForm } from "@/components/dashboard/edit-patient-process-form";
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

function formatDateOnly(value: string | null) {
  if (!value) {
    return "Por definir";
  }

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

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
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Sin actualización registrada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin actualización registrada";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(date);
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

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_my_assigned_patient_detail",
    {
      target_patient_id: patientId,
    },
  );

  if (error) {
    console.error(
      "Error loading assigned patient detail:",
      error,
    );

    redirect(
      "/dashboard/mis-pacientes",
    );
  }

  const patient =
    (
      (data ?? []) as AssignedPatientDetail[]
    )[0] ?? null;

  if (!patient) {
    redirect(
      "/dashboard/mis-pacientes",
    );
  }

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

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6E5648]">
                Registra el estado actual del
                acompañamiento. Esta información
                puede actualizarse a medida que
                avance el proceso.
              </p>
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
            patientId={patient.patient_id}
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

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Sesiones
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Agenda terapéutica
            </h2>

            <p className="mt-4 leading-8 text-[#6E5648]">
              La programación, historial y gestión
              de sesiones se habilitará en una
              siguiente fase.
            </p>

            <span className="mt-6 inline-flex rounded-full border border-[#DED2C5] bg-[#FAF6F1] px-5 py-2.5 text-sm font-semibold text-[#80695B]">
              Próximamente
            </span>
          </section>

          <section className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Recursos
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Material terapéutico
            </h2>

            <p className="mt-4 leading-8 text-[#6E5648]">
              Desde este espacio podrás asignar
              guías, ejercicios, enlaces y otros
              recursos al paciente.
            </p>

            <span className="mt-6 inline-flex rounded-full border border-[#DED2C5] bg-[#FAF6F1] px-5 py-2.5 text-sm font-semibold text-[#80695B]">
              Próximamente
            </span>
          </section>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#DCC9D7] bg-[#F4EAF2] p-6 md:p-8">
          <p className="font-semibold">
            Ficha protegida
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#6E5648]">
            Esta ficha únicamente puede abrirse
            cuando el paciente está asignado al
            psicólogo autenticado. El guardado del
            proceso vuelve a validar esa asignación
            directamente en Supabase.
          </p>
        </div>
      </section>
    </main>
  );
}