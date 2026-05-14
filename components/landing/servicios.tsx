export function Servicios() {
  return (
    <section id="servicios" className="mx-auto max-w-6xl px-6 py-24 md:px-10">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
          Servicios
        </p>

        <h2 className="mt-4 text-3xl font-bold md:text-5xl">
          Servicios principales
        </h2>

        <p className="mt-5 text-lg leading-8 text-[#6E5648]">
          Un acompañamiento diseñado para ayudarte a comprender lo que vives,
          fortalecer tu mundo emocional y avanzar con mayor claridad.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm transition hover:-translate-y-1">
          <div className="mb-5 inline-flex rounded-full bg-[#F6EFE8] px-3 py-1 text-sm font-medium text-[#8C5A3C]">
            Acompañamiento personal
          </div>

          <h3 className="text-2xl font-semibold">Terapia individual</h3>

          <p className="mt-4 leading-8 text-[#6E5648]">
            Espacio terapéutico para trabajar ansiedad, autoestima, límites,
            duelos, identidad y bienestar emocional.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm transition hover:-translate-y-1">
          <div className="mb-5 inline-flex rounded-full bg-[#F6EFE8] px-3 py-1 text-sm font-medium text-[#8C5A3C]">
            Vínculo y conexión
          </div>

          <h3 className="text-2xl font-semibold">Terapia de pareja</h3>

          <p className="mt-4 leading-8 text-[#6E5648]">
            Acompañamiento para fortalecer comunicación, comprensión mutua,
            límites y reconstrucción del vínculo.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm transition hover:-translate-y-1">
          <div className="mb-5 inline-flex rounded-full bg-[#F6EFE8] px-3 py-1 text-sm font-medium text-[#8C5A3C]">
            Apoyo complementario
          </div>

          <h3 className="text-2xl font-semibold">Recursos digitales</h3>

          <p className="mt-4 leading-8 text-[#6E5648]">
            Ebooks, herramientas y materiales de apoyo para profundizar tu
            proceso fuera de sesión.
          </p>
        </div>
      </div>
    </section>
  );
}