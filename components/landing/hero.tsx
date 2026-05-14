export function Hero() {
  return (
    <section
      id="inicio"
      className="mx-auto grid min-h-[92vh] max-w-6xl items-center gap-16 px-6 py-24 md:grid-cols-2 md:px-10"
    >
      <div className="pt-4 md:pt-8">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
          Bienestar emocional con propósito
        </p>

        <h1 className="max-w-md text-4xl font-bold leading-[1.08] md:text-5xl">
          Un espacio terapéutico para sanar, fortalecerte y volver a ti
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-[#6E5648]">
          Acompaño procesos emocionales desde una mirada profesional, humana e
          integral, para que construyas bienestar, claridad y liderazgo
          personal en tu vida.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20empezar%20mi%20proceso%20con%20Lorena%20Wellness%20TuPsico."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C]"
          >
            Agendar proceso
          </a>

          <a
            href="/servicios"
            className="inline-flex items-center justify-center rounded-full border border-[#DED2C5] bg-[#FFFDFC] px-8 py-3.5 text-[#4E3427] transition hover:bg-[#F6EFE8]"
          >
            Ver recursos
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#6E5648]">
          <span className="rounded-full bg-[#F3E7DA] px-4 py-2">
            Atención online
          </span>
          <span className="rounded-full bg-[#F3E7DA] px-4 py-2">
            Acompañamiento profesional
          </span>
          <span className="rounded-full bg-[#F3E7DA] px-4 py-2">
            Recursos de apoyo
          </span>
        </div>
      </div>

      <div className="rounded-[2.4rem] bg-[#EEDFD0] p-5 shadow-sm md:p-8">
        <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 md:p-10">
          <div className="inline-flex rounded-full bg-[#F6EFE8] px-4 py-2 text-sm font-medium text-[#8C5A3C]">
            Espacio terapéutico integral
          </div>

          <h2 className="mt-6 max-w-md text-3xl font-bold leading-tight">
            Psicología, bienestar integral y transformación personal
          </h2>

          <p className="mt-5 max-w-lg leading-8 text-[#6E5648]">
            Este espacio digital está diseñado para acompañarte con terapia,
            recursos emocionales y herramientas que impulsen tu proceso de
            crecimiento con estructura, sensibilidad y dirección.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#FAF6F1] p-5">
              <p className="text-sm font-semibold text-[#8C5A3C]">Enfoque</p>
              <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                Acompañamiento humano, profesional e integral.
              </p>
            </div>

            <div className="rounded-2xl bg-[#FAF6F1] p-5">
              <p className="text-sm font-semibold text-[#8C5A3C]">Objetivo</p>
              <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                Favorecer bienestar, claridad y crecimiento personal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}