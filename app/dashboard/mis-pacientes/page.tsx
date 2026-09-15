import Link from "next/link";

import { requirePsychologist } from "@/lib/auth/require-psychologist";

type AssignedPatient = {
  patient_id: string;
  profile_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  start_date: string | null;
  payment_status: string;
  access_status: string;
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
    dateStyle: "medium",
    timeZone: "UTC",
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

export default async function MyPatientsPage() {
  const {
    supabase,
    profile,
  } = await requirePsychologist();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_my_assigned_patients",
  );

  if (error) {
    console.error(
      "Error loading assigned patients:",
      error,
    );

    throw new Error(
      "No fue posible cargar los pacientes asignados.",
    );
  }

  const patients =
    (data ?? []) as AssignedPatient[];

  const activePatients = patients.filter(
    (patient) =>
      patient.access_status === "active",
  ).length;

  const paidPatients = patients.filter(
    (patient) =>
      patient.payment_status === "paid",
  ).length;

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
            Espacio profesional
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Mis pacientes
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Consulta únicamente las personas que han
            sido asignadas a tu perfil profesional
            dentro de Lorena Wellness TuPsico.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-[#76516E] px-5 py-3 text-sm font-semibold text-white">
              {patients.length} paciente
              {patients.length === 1 ? "" : "s"}{" "}
              asignado
              {patients.length === 1 ? "" : "s"}
            </span>

            <span className="rounded-full border border-[#DCC9D7] bg-white px-5 py-3 text-sm font-semibold text-[#76516E]">
              {activePatients} con acceso activo
            </span>

            <span className="rounded-full border border-[#DCC9D7] bg-white px-5 py-3 text-sm font-semibold text-[#76516E]">
              {paidPatients} con pago registrado
            </span>
          </div>
        </div>

        <section className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
                Pacientes asignados
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Mi carga actual
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
                No tienes pacientes asignados
              </p>

              <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-[#6E5648]">
                Cuando el administrador asigne un
                paciente a tu perfil profesional,
                aparecerá automáticamente en este
                espacio.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5">
              {patients.map((patient) => (
                <article
                  key={patient.patient_id}
                  className="rounded-[1.75rem] border border-[#E7D8C8] bg-[#FAF6F1] p-5 transition hover:border-[#CDB7C8] hover:shadow-sm md:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                        Paciente asignado
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold">
                        {patient.full_name}
                      </h3>

                      <p className="mt-2 break-all text-sm text-[#6E5648]">
                        {patient.email ??
                          "Correo no registrado"}
                      </p>

                      {patient.phone ? (
                        <p className="mt-1 text-sm text-[#6E5648]">
                          {patient.phone}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getAccessStatusClasses(
                          patient.access_status,
                        )}`}
                      >
                        Acceso:{" "}
                        {getAccessStatusLabel(
                          patient.access_status,
                        )}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusClasses(
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

                  <div className="mt-6 grid gap-5 border-t border-[#E7D8C8] pt-5 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold">
                        Fecha de nacimiento
                      </p>

                      <p className="mt-1 text-sm leading-7 text-[#6E5648]">
                        {formatDateOnly(
                          patient.birth_date,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Inicio del proceso
                      </p>

                      <p className="mt-1 text-sm leading-7 text-[#6E5648]">
                        {formatDateOnly(
                          patient.start_date,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#E7D8C8] pt-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-2xl text-sm leading-7 text-[#6E5648]">
                        Abre la ficha individual para
                        consultar el plan y el
                        seguimiento terapéutico
                        autorizado.
                      </p>

                      <Link
                        href={`/dashboard/mis-pacientes/${patient.patient_id}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#76516E] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#66445F]"
                      >
                        Abrir ficha
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 rounded-[2rem] border border-[#DCC9D7] bg-[#F4EAF2] p-6 md:p-8">
          <p className="font-semibold text-[#4E3427]">
            Acceso protegido
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#6E5648]">
            Este listado se obtiene utilizando tu
            sesión profesional. La plataforma no
            solicita un identificador de psicólogo
            desde el navegador, por lo que solamente
            se muestran pacientes asignados a tu
            propia cuenta.
          </p>
        </div>
      </section>
    </main>
  );
}