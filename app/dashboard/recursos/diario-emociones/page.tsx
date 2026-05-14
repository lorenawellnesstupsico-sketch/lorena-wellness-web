import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrivateNav } from "@/components/dashboard/private-nav";

export default async function DiarioEmocionesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <section className="border-b border-[#E6D8CB] bg-[linear-gradient(180deg,#FAF6F1_0%,#F7F1EA_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
                Lorena Wellness TuPsico
              </p>
              <p className="mt-2 text-sm text-[#6E5648]">Ejercicio privado</p>
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

      <section className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        <div className="rounded-[2rem] border border-[#E7D8C8] bg-[linear-gradient(135deg,#FFFDFC_0%,#F8EEE4_100%)] p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Ejercicio práctico
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Diario breve de emociones
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Este ejercicio está diseñado para ayudarte a identificar lo que
            sientes, ponerle nombre a tu experiencia y ganar más claridad sobre
            lo que estás viviendo.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Instrucciones
          </p>

          <p className="mt-4 leading-8 text-[#6E5648]">
            Busca un momento tranquilo del día y responde estas preguntas con
            honestidad. No tienes que escribir mucho. Lo importante es observar
            y registrar con claridad.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Pregunta 1
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              ¿Qué emoción estuvo más presente hoy?
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Trata de nombrarla con precisión: tristeza, ansiedad, frustración,
              alivio, culpa, calma, enojo, miedo o cualquier otra emoción que
              reconozcas en ti.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Pregunta 2
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              ¿Qué situación pudo activar esa emoción?
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Piensa en una conversación, una exigencia, un recuerdo, una
              expectativa o un momento específico del día que haya influido en
              cómo te sentiste.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Pregunta 3
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              ¿Qué necesitabas en ese momento?
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              A veces no necesitamos una solución enorme, sino algo concreto:
              descanso, apoyo, claridad, validación, poner un límite o darte una
              pausa.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Pregunta 4
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              ¿Qué acción pequeña puedo hacer por mí?
            </h2>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Elige una acción simple y realista que te ayude a acompañarte
              mejor hoy. Lo importante es que sea concreta y posible.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#E7D8C8] bg-[#F3E7DA] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Reflexión final
          </p>

          <p className="mt-4 leading-8 text-[#6E5648]">
            Observar tus emociones no te debilita. Te da información. Y esa
            información puede ayudarte a relacionarte contigo con más consciencia,
            menos juicio y mayor cuidado personal.
          </p>
        </div>
      </section>
    </main>
  );
}