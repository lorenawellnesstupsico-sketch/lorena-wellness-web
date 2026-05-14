import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function GuiaEmocionalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <section className="border-b border-[#DED2C5] bg-[#FAF6F1]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
              Lorena Wellness TuPsico
            </p>
            <p className="mt-1 text-sm text-[#6E5648]">Guía emocional privada</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/recursos"
              className="rounded-full border border-[#DED2C5] bg-white px-5 py-2.5 text-sm text-[#4E3427] transition hover:bg-[#F6EFE8]"
            >
              Volver a recursos
            </Link>

            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-[#DED2C5] bg-white px-5 py-2.5 text-sm text-[#4E3427] transition hover:bg-[#F6EFE8]"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
          Guía emocional
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
          Volver a ti con más calma
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
          Esta guía está pensada para ayudarte a detenerte, observar cómo te
          sientes y reconectar contigo desde un lugar más compasivo, claro y
          consciente.
        </p>

        <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Antes de empezar
          </p>

          <p className="mt-4 leading-8 text-[#6E5648]">
            No necesitas tener todas las respuestas hoy. Este espacio no busca
            que te exijas más, sino que puedas hacer una pausa, escucharte y
            darte permiso para volver a ti con más suavidad.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Paso 1
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Ponle nombre a lo que sientes
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Antes de querer cambiar lo que estás viviendo, intenta identificar
              qué emoción está más presente hoy. A veces no es tristeza, sino
              agotamiento. No es enojo, sino frustración. Nombrarlo da orden.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Paso 2
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Pregúntate qué necesitas
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              En lugar de preguntarte solo qué te pasa, intenta preguntarte qué
              necesitas hoy. Tal vez descanso, claridad, hablar con alguien,
              poner un límite o simplemente dejar de exigirte tanto por un
              momento.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Paso 3
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Elige una acción pequeña
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Volver a ti no siempre implica hacer algo enorme. A veces empieza
              con una acción pequeña pero honesta: escribir lo que sientes,
              respirar profundo, salir un momento, tomar agua o darte un espacio
              de pausa real.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#E7D8C8] bg-[#F3E7DA] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Ejercicio breve
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Mini chequeo emocional
          </h2>

          <div className="mt-4 space-y-3 leading-8 text-[#6E5648]">
            <p>1. ¿Qué emoción noto más fuerte en este momento?</p>
            <p>2. ¿Qué situación puede estar activándola?</p>
            <p>3. ¿Qué necesito hoy para acompañarme mejor?</p>
            <p>4. ¿Qué acción pequeña puedo hacer por mí antes de terminar el día?</p>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Cierre
          </p>

          <p className="mt-4 leading-8 text-[#6E5648]">
            No tienes que volver a ti de golpe. Puedes hacerlo poco a poco, con
            presencia, con honestidad y con más amabilidad contigo. Esa también
            es una forma profunda de empezar a sanar.
          </p>
        </div>
      </section>
    </main>
  );
}