import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrivateNav } from "@/components/dashboard/private-nav";

export default async function PerfilPage() {
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
              <p className="mt-2 text-sm text-[#6E5648]">Perfil privado</p>
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
            Perfil
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Tu información personal
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Este espacio reúne la información principal de tu cuenta y sirve
            como base para una experiencia más clara, organizada y personalizada
            dentro de la plataforma.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Datos principales
            </p>

            <div className="mt-6 space-y-6 text-[#6E5648]">
              <div className="rounded-[1.5rem] border border-[#EFE3D8] bg-[#FAF6F1] p-5">
                <p className="text-sm font-semibold text-[#4E3427]">
                  Nombre visible
                </p>
                <p className="mt-2 text-lg">{displayName}</p>
              </div>

              <div className="rounded-[1.5rem] border border-[#EFE3D8] bg-[#FAF6F1] p-5">
                <p className="text-sm font-semibold text-[#4E3427]">
                  Correo electrónico
                </p>
                <p className="mt-2 break-all text-lg">{user.email}</p>
              </div>

              <div className="rounded-[1.5rem] border border-[#EFE3D8] bg-[#FAF6F1] p-5">
                <p className="text-sm font-semibold text-[#4E3427]">
                  Estado de la cuenta
                </p>
                <p className="mt-2 text-lg">Acceso activo</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#F3E7DA] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Tu cuenta
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              Un perfil claro, simple y ordenado
            </h2>

            <p className="mt-4 leading-8 text-[#6E5648]">
              Esta sección te permite ubicar rápidamente la información
              principal asociada a tu espacio privado y mantener una referencia
              clara de tu cuenta.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-[#8C5A3C]">
              Próximamente: más personalización
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Más adelante
          </p>

          <h2 className="mt-4 text-2xl font-semibold">
            Esta sección podrá crecer contigo
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-[#6E5648]">
            En el siguiente nivel podremos integrar opciones para editar tu
            nombre visible, personalizar ciertos datos de la experiencia y
            gestionar mejor la información de tu cuenta.
          </p>
        </div>
      </section>
    </main>
  );
}