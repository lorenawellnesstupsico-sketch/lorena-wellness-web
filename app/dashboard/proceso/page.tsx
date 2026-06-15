import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrivateNav } from "@/components/dashboard/private-nav";
import { SubmitButton } from "@/components/ui/submit-button";
import { guardarProceso } from "./actions";

type Proceso = {
  id: string;
  enfoque_actual: string | null;
  objetivo_principal: string | null;
  trabajo_actual: string | null;
  siguiente_paso: string | null;
  recordatorio_terapeutico: string | null;
};

type ProcesoPageProps = {
  searchParams?: Promise<{ success?: string; error?: string }>;
};

export default async function ProcesoPage({
  searchParams,
}: ProcesoPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const success = params?.success;
  const error = params?.error ? decodeURIComponent(params.error) : "";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";

  const { data: procesos } = await supabase
    .from("procesos")
    .select(
      "id, enfoque_actual, objetivo_principal, trabajo_actual, siguiente_paso, recordatorio_terapeutico"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const proceso = (procesos as Proceso[] | null)?.[0] || null;

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <section className="border-b border-[#E6D8CB] bg-[linear-gradient(180deg,#FAF6F1_0%,#F7F1EA_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
                Lorena Wellness TuPsico
              </p>
              <p className="mt-2 text-sm text-[#6E5648]">Proceso privado</p>
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
            Mi proceso
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Un espacio para comprender tu proceso con más claridad, {displayName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Aquí podrás ver y actualizar información real de tu proceso para
            mantener presente el enfoque actual y el siguiente paso que quieres
            sostener.
          </p>
        </div>

        {success === "saved" ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#D9CBBE] bg-[#F3E7DA] px-5 py-4 text-sm text-[#6E5648]">
            Los cambios de tu proceso se guardaron correctamente.
          </div>
        ) : null}

        {error ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#E7C9C1] bg-[#FFF3F0] px-5 py-4 text-sm text-[#8A4B38]">
            {error}
          </div>
        ) : null}

        <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Actualizar proceso
          </p>

          <h2 className="mt-4 text-2xl font-semibold">
            Edita tu información principal desde la plataforma
          </h2>

          <form action={guardarProceso} className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Enfoque actual
              </label>
              <input
                name="enfoque_actual"
                type="text"
                defaultValue={proceso?.enfoque_actual || ""}
                placeholder="Ej. Claridad emocional"
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Objetivo principal
              </label>
              <input
                name="objetivo_principal"
                type="text"
                defaultValue={proceso?.objetivo_principal || ""}
                placeholder="Ej. Fortalecer la relación contigo"
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Lo que estás trabajando
              </label>
              <textarea
                name="trabajo_actual"
                rows={4}
                defaultValue={proceso?.trabajo_actual || ""}
                placeholder="Describe aquí el foco actual del proceso..."
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Siguiente paso
              </label>
              <textarea
                name="siguiente_paso"
                rows={4}
                defaultValue={proceso?.siguiente_paso || ""}
                placeholder="Ej. Registrar con más honestidad lo que sientes..."
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Recordatorio terapéutico
              </label>
              <textarea
                name="recordatorio_terapeutico"
                rows={4}
                defaultValue={proceso?.recordatorio_terapeutico || ""}
                placeholder="Escribe aquí un recordatorio importante..."
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div className="md:col-span-2">
              <SubmitButton
                idleText="Guardar cambios"
                loadingText="Guardando..."
                className="rounded-full bg-[#C97B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B96E4C] disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>
          </form>
        </div>

        {proceso ? (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-7 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                  Enfoque actual
                </p>
                <h2 className="mt-4 text-2xl font-semibold">
                  {proceso.enfoque_actual || "Sin dato"}
                </h2>
                <p className="mt-4 leading-8 text-[#6E5648]">
                  Este es el eje principal que hoy orienta tu proceso.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-7 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                  Objetivo principal
                </p>
                <h2 className="mt-4 text-2xl font-semibold">
                  {proceso.objetivo_principal || "Sin dato"}
                </h2>
                <p className="mt-4 leading-8 text-[#6E5648]">
                  Esto refleja lo que hoy buscas fortalecer con más intención.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-7 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                  Lo que estás trabajando
                </p>
                <h2 className="mt-4 text-2xl font-semibold">
                  {proceso.trabajo_actual || "Sin dato"}
                </h2>
                <p className="mt-4 leading-8 text-[#6E5648]">
                  Aquí puedes ver con más claridad el foco actual de tu trabajo
                  terapéutico.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-7 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                  Siguiente paso
                </p>
                <h2 className="mt-4 text-2xl font-semibold">
                  {proceso.siguiente_paso || "Sin dato"}
                </h2>
                <p className="mt-4 leading-8 text-[#6E5648]">
                  Una acción concreta puede ayudarte a sostener tu proceso con
                  más dirección.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                  Recordatorio terapéutico
                </p>

                <h2 className="mt-4 text-2xl font-semibold">
                  {proceso.recordatorio_terapeutico || "Sin recordatorio"}
                </h2>

                <p className="mt-4 max-w-2xl leading-8 text-[#6E5648]">
                  Mantener visible este recordatorio puede ayudarte a volver a tu
                  proceso con más presencia y menos exigencia.
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
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#4E3427]">
              Aún no has registrado información de tu proceso
            </h2>
            <p className="mt-4 max-w-3xl leading-8 text-[#6E5648]">
              Cuando completes este espacio, aquí podrás visualizar tu enfoque
              actual, tu objetivo principal, lo que estás trabajando y el
              recordatorio terapéutico que quieres mantener presente.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-[#F3E7DA] px-4 py-2 text-sm font-medium text-[#8C5A3C]">
              Completa el formulario para empezar
            </div>
          </div>
        )}

        <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Tu espacio
          </p>

          <h2 className="mt-4 text-2xl font-semibold">
            Un proceso más claro, visible y sostenible
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-[#6E5648]">
            Esta sección está pensada para ayudarte a ubicar tu momento actual,
            sostener tu dirección terapéutica y recordar lo que hoy necesitas
            trabajar con más consciencia.
          </p>
        </div>
      </section>
    </main>
  );
}