import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PrivateNav } from "@/components/dashboard/private-nav";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <section className="border-b border-[#E6D8CB] bg-[linear-gradient(180deg,#FAF6F1_0%,#F7F1EA_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
                Lorena Wellness TuPsico
              </p>
              <p className="mt-2 text-sm text-[#6E5648]">
                Espacio privado de acompañamiento
              </p>
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

          <PrivateNav />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="rounded-[2rem] border border-[#E7D8C8] bg-[linear-gradient(135deg,#FFFDFC_0%,#F8EEE4_100%)] p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Dashboard
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Bienvenida, {displayName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Este espacio reúne lo más importante de tu proceso para que puedas
            volver a ti con más claridad, orden y presencia cada vez que lo
            necesites.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard/proceso"
              className="rounded-full bg-[#C97B57] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#B96E4C]"
            >
              Ir a mi proceso
            </Link>

            <Link
              href="/dashboard/sesiones"
              className="rounded-full border border-[#DED2C5] bg-white px-5 py-3 text-sm font-medium text-[#4E3427] transition hover:bg-[#F6EFE8]"
            >
              Ver mis sesiones
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/dashboard/proceso"
            className="group rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Mi proceso
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              Seguimiento personal
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Revisa el enfoque actual de tu proceso, lo que estás trabajando y
              el siguiente paso que quieres sostener.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-[#F3E7DA] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition group-hover:bg-[#EAD9C8]">
              Ver proceso
            </div>
          </Link>

          <Link
            href="/dashboard/recursos"
            className="group rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Recursos
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              Materiales de apoyo
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Accede a guías, ejercicios y herramientas pensadas para
              acompañarte con más claridad entre sesiones.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-[#F3E7DA] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition group-hover:bg-[#EAD9C8]">
              Explorar recursos
            </div>
          </Link>

          <Link
            href="/dashboard/sesiones"
            className="group rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Sesiones
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              Organización y seguimiento
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Consulta tu próxima sesión, revisa tu historial y mantén más orden
              dentro de tu acompañamiento.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-[#F3E7DA] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition group-hover:bg-[#EAD9C8]">
              Ver sesiones
            </div>
          </Link>

          <Link
            href="/dashboard/perfil"
            className="group rounded-[2rem] border border-[#E2C6B2] bg-[linear-gradient(135deg,#FFF7F2_0%,#F9E9DD_100%)] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Perfil
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              Cuenta e información
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Visualiza tu información principal y mantén una base clara de tu
              espacio personal dentro de la plataforma.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-[#C97B57] px-4 py-2 text-sm font-medium text-white transition group-hover:bg-[#B96E4C]">
              Ver perfil
            </div>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Tu espacio
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              Una plataforma pensada para acompañarte mejor
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-[#6E5648]">
              La intención de este espacio no es solo organizar información,
              sino ayudarte a volver a tu proceso con más consciencia, sostén y
              continuidad.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#F3E7DA] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Cuenta activa
            </p>

            <div className="mt-5 space-y-4 text-sm leading-7 text-[#6E5648]">
              <p>
                <span className="font-semibold text-[#4E3427]">Nombre:</span>{" "}
                {displayName}
              </p>

              <p>
                <span className="font-semibold text-[#4E3427]">Correo:</span>{" "}
                {user.email}
              </p>

              <p>
                <span className="font-semibold text-[#4E3427]">
                  Estado de acceso:
                </span>{" "}
                Activo
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}