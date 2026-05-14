export function Acompanamiento() {
  return (
    <section id="acompanamiento" className="bg-[#F6EFE8] px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Acompañamiento
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            Cómo te acompaño en tu proceso
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#6E5648]">
            Un proceso guiado con escucha, estructura y herramientas prácticas
            para ayudarte a avanzar con mayor claridad emocional.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8C5A3C]">01</p>
            <h3 className="mt-4 text-2xl font-semibold">Escucha y evaluación</h3>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Comprendemos lo que estás viviendo y definimos el enfoque más útil
              para tu proceso.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8C5A3C]">02</p>
            <h3 className="mt-4 text-2xl font-semibold">Intervención y guía</h3>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Trabajamos con herramientas terapéuticas, psicoeducación y
              estrategias prácticas aplicables a tu realidad.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8C5A3C]">03</p>
            <h3 className="mt-4 text-2xl font-semibold">Seguimiento y avance</h3>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Hacemos seguimiento a tu progreso para fortalecer cambios
              sostenibles y mayor bienestar emocional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}