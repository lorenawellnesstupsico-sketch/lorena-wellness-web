import Image from "next/image";

export function Testimonios() {
  return (
    <section id="testimonios" className="mx-auto max-w-6xl px-6 py-16 md:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Enfoque
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight text-[#4E3427] md:text-5xl">
            Un acompañamiento que integra calidez humana, claridad terapéutica y
            continuidad emocional.
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#6E5648]">
            La experiencia está pensada para que no solo te sientas acompañada,
            sino también orientada. Aquí el proceso busca tener estructura,
            sentido y una presencia más visible dentro de tu camino emocional.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.75rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#4E3427]">Cercanía</h3>
              <p className="mt-3 leading-8 text-[#6E5648]">
                Un espacio emocionalmente seguro donde puedas hablar con
                honestidad, sin sentirte juzgada y con una presencia terapéutica
                real.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#4E3427]">Claridad</h3>
              <p className="mt-3 leading-8 text-[#6E5648]">
                Una experiencia donde tu proceso puede tener foco, seguimiento y
                una dirección más visible.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#E2C6B2] bg-[linear-gradient(135deg,#FFF7F2_0%,#F9E9DD_100%)] p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#4E3427]">
                Continuidad
              </h3>
              <p className="mt-3 leading-8 text-[#6E5648]">
                Recursos y herramientas que te ayudan a no soltar tu trabajo
                interno cuando termina la sesión.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="overflow-hidden rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] shadow-sm">
            <div className="relative h-[260px] w-full md:h-[320px]">
              <Image
                src="/enfoque-nuevo.jpg"
                alt="Apoyo visual del enfoque terapéutico"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
                Bienestar con intención
              </p>
              <p className="mt-3 leading-8 text-[#6E5648]">
                Nuestro enfoque es cognitivo conductual
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem] border border-[#E7D8C8] bg-[#F8F1EA] p-3">
                <Image
                  src="/logo-tupsico.png"
                  alt="Logo TuPsico"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-[#4E3427]">
                Una experiencia más organizada
              </h3>

              <p className="mt-3 leading-8 text-[#6E5648]">
                Tu espacio privado te permite sostener sesiones, objetivos y
                recursos dentro de una experiencia más clara.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#E2C6B2] bg-[linear-gradient(135deg,#FFF7F2_0%,#F6E7DA_100%)] p-6 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-[#E7D8C8] bg-white text-2xl shadow-sm">
                ✦
              </div>

              <h3 className="mt-5 text-xl font-semibold text-[#4E3427]">
                Más presencia en tu camino
              </h3>

              <p className="mt-3 leading-8 text-[#6E5648]">
                No se trata solo de asistir a una sesión, sino de sentir que tu
                proceso sigue teniendo lugar entre encuentro y encuentro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}