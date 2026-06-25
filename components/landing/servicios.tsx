// components/landing/servicios.tsx
import Image from "next/image";

export function Servicios() {
  return (
    <section id="servicios" className="mx-auto max-w-6xl px-6 py-16 md:px-10">
      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_140px] md:gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Servicios
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-[#4E3427] md:text-5xl">
            ¿Cuánto tiempo más vas a esperar para sentirte bien?
          </h2>

          <p className="mt-6 max-w-none text-lg leading-8 text-[#6E5648]">
            Elige la experiencia de acompañamiento que mejor responda a tu
            momento actual. Cada plan está pensado para ofrecerte estructura,
            continuidad y un espacio terapéutico con intención.
          </p>
        </div>

        <div className="flex justify-start md:justify-end">
          <div className="flex h-[250px] w-[1000px] items-center justify-center rounded-[4rem] border border-[#E7D8C8] bg-[#FFFDFC] p-5 shadow-sm">
            <Image
              src="/logo-tupsico.png"
              alt="Logo TuPsico"
              width={90}
              height={90}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="flex min-h-[420px] flex-col rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Plan 1
            </p>

            <h3 className="mt-4 text-3xl font-bold text-[#4E3427]">
              AMARME · INICIO
            </h3>

            <p className="mt-5 leading-8 text-[#6E5648]">
              Un primer acercamiento para comprender tu momento actual, ordenar
              lo que sientes y abrir el camino hacia tu proceso personal.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm leading-7 text-[#6E5648]">
            <p>
              <span className="font-semibold text-[#4E3427]">Sesiones:</span> 1
              sesión
            </p>
            <p>
              <span className="font-semibold text-[#4E3427]">Duración:</span> 60
              minutos
            </p>
          </div>

          <div className="mt-auto pt-8">
            <div className="rounded-[1.5rem] border border-[#E7D8C8] bg-[#F8F1EA] px-5 py-4 text-center">
              <p className="text-3xl font-bold text-[#8C5A3C]">$75.000</p>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#6E5648]">
                COP
              </p>
            </div>
          </div>
        </article>

        <article className="flex min-h-[420px] flex-col rounded-[2rem] border border-[#E2C6B2] bg-[linear-gradient(135deg,#FFF7F2_0%,#F9E9DD_100%)] p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Plan 2
            </p>

            <h3 className="mt-4 text-3xl font-bold text-[#4E3427]">
              AMARME · PROCESO
            </h3>

            <p className="mt-5 leading-8 text-[#6E5648]">
              Un acompañamiento continuo para sostener tu proceso, profundizar
              en ti y avanzar con mayor claridad y guía profesional.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm leading-7 text-[#6E5648]">
            <p>
              <span className="font-semibold text-[#4E3427]">Sesiones:</span> 4
              sesiones
            </p>
            <p>
              <span className="font-semibold text-[#4E3427]">Duración:</span> 60
              minutos cada una
            </p>
          </div>

          <div className="mt-auto pt-8">
            <div className="rounded-[1.5rem] border border-[#E7D8C8] bg-white/80 px-5 py-4 text-center">
              <p className="text-3xl font-bold text-[#8C5A3C]">$240.000</p>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#6E5648]">
                COP
              </p>
            </div>
          </div>
        </article>

        <article className="flex min-h-[420px] flex-col rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Plan 3
            </p>

            <h3 className="mt-4 text-3xl font-bold text-[#4E3427]">
              AMARME · PROFUNDO
            </h3>

            <p className="mt-5 leading-8 text-[#6E5648]">
              Un proceso terapéutico más profundo para transformar tu historia
              emocional y construir una forma más consciente de vivir y
              relacionarte contigo.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm leading-7 text-[#6E5648]">
            <p>
              <span className="font-semibold text-[#4E3427]">Sesiones:</span> 6
              sesiones
            </p>
            <p>
              <span className="font-semibold text-[#4E3427]">Duración:</span> 60
              minutos cada una
            </p>
          </div>

          <div className="mt-auto pt-8">
            <div className="rounded-[1.5rem] border border-[#E7D8C8] bg-[#F8F1EA] px-5 py-4 text-center">
              <p className="text-3xl font-bold text-[#8C5A3C]">$350.000</p>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#6E5648]">
                COP
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}