import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/ui/submit-button";

type RegistroPageProps = {
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function RegistroPage({
  searchParams,
}: RegistroPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const error = params?.error ? decodeURIComponent(params.error) : "";
  const success = params?.success ? decodeURIComponent(params.success) : "";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1] px-6 py-16 text-[#4E3427] md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-[#E7D8C8] bg-[linear-gradient(135deg,#FFFDFC_0%,#F8EEE4_100%)] p-8 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
              Registro
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Crea tu acceso a la plataforma
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#6E5648]">
              Regístrate para guardar tu proceso, visualizar tus sesiones y
              acceder a tus recursos dentro de tu espacio privado.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                Bienestar con propósito
              </p>
              <p className="mt-4 leading-8 text-[#6E5648]">
                Una plataforma pensada para acompañarte con más claridad,
                presencia y organización a lo largo de tu proceso.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm md:p-10">
            <h2 className="text-2xl font-semibold">Crea tu cuenta</h2>

            <p className="mt-3 leading-8 text-[#6E5648]">
              Completa estos datos para comenzar.
            </p>

            {error ? (
              <div className="mt-6 rounded-[1.25rem] border border-[#E7C9C1] bg-[#FFF3F0] px-4 py-3 text-sm text-[#8A4B38]">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mt-6 rounded-[1.25rem] border border-[#D9CBBE] bg-[#F3E7DA] px-4 py-3 text-sm text-[#6E5648]">
                {success}
              </div>
            ) : null}

            <form action="/auth/registro" method="post" className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                  Nombre visible
                </label>
                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                  Correo electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                  Contraseña
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Crea una contraseña segura"
                  className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
                />
              </div>

              <SubmitButton
                idleText="Crear cuenta"
                loadingText="Creando cuenta..."
                className="w-full rounded-full bg-[#C97B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B96E4C] disabled:cursor-not-allowed disabled:opacity-70"
              />
            </form>

            <p className="mt-6 text-sm leading-7 text-[#6E5648]">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-[#8C5A3C] underline underline-offset-4"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}