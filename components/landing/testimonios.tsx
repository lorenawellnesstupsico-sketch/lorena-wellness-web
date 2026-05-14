export function Testimonios() {
  return (
    <section id="testimonios" className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Confianza
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
            Un espacio pensado para acompañarte con claridad y calidez
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#6E5648]">
            Cada proceso está guiado desde la escucha, la estructura terapéutica
            y el compromiso con tu bienestar emocional.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Acompañamiento humano
            </p>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Un espacio de escucha respetuosa, validación emocional y cuidado
              real de tu proceso.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Enfoque profesional
            </p>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Intervención con estructura, herramientas prácticas y dirección
              clara para acompañarte mejor.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Proceso integral
            </p>
            <p className="mt-4 leading-8 text-[#6E5648]">
              Terapia, recursos y seguimiento en un espacio pensado para tu
              crecimiento emocional y personal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}