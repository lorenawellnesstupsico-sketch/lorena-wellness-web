import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/ui/submit-button";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const error = params?.error ? decodeURIComponent(params.error) : "";

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
              Ingresar
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Vuelve a tu espacio privado
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#6E5648]">
              Ingresa para continuar con tu proceso, revisar tus sesiones y
              acceder a tus recursos dentro de la plataforma.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                Lorena Wellness TuPsico
              </p>
              <p className="mt-4 leading-8 text-[#6E5648]">
                Un espacio diseñado para acompañarte con más claridad, orden y
                cercanía en cada etapa de tu proceso.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm md:p-10">
            <h2 className="text-2xl font-semibold">Ingresa a tu cuenta</h2>

            <p className="mt-3 leading-8 text-[#6E5648]">
              Usa el correo y la contraseña con los que te registraste.
            </p>

            {error ? (
              <div className="mt-6 rounded-[1.25rem] border border-[#E7C9C1] bg-[#FFF3F0] px-4 py-3 text-sm text-[#8A4B38]">
                {error}
              </div>
            ) : null}

            <form action="/auth/login" method="post" className="mt-8 space-y-5">
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
                  placeholder="Ingresa tu contraseña"
                  className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
                />
              </div>

              <SubmitButton
                idleText="Ingresar"
                loadingText="Ingresando..."
                className="w-full rounded-full bg-[#C97B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B96E4C] disabled:cursor-not-allowed disabled:opacity-70"
              />
            </form>

            <p className="mt-6 text-sm leading-7 text-[#6E5648]">
              ¿Aún no tienes cuenta?{" "}
              <Link
                href="/registro"
                className="font-medium text-[#8C5A3C] underline underline-offset-4"
              >
                Regístrate aquí
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}