export default function SobreMiPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <section className="border-b border-[#DED2C5] bg-[#FAF6F1]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <a
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]"
          >
            Lorena Wellness TuPsico
          </a>

          <nav className="hidden gap-8 text-sm text-[#6E5648] md:flex">
            <a href="/" className="transition hover:text-[#C97B57]">
              Inicio
            </a>
            <a href="/servicios" className="transition hover:text-[#C97B57]">
              Servicios
            </a>
            <a href="/sobre-mi" className="transition hover:text-[#C97B57]">
              Sobre mí
            </a>
            <a href="/#contacto" className="transition hover:text-[#C97B57]">
              Contacto
            </a>
          </nav>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Sobre mí
          </p>

          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight md:text-6xl">
            Un acompañamiento humano, profesional e integral
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6E5648]">
            Soy Lorena Wellness TuPsico y he creado este espacio para acompañar
            procesos emocionales con sensibilidad, estructura terapéutica y una
            visión integral del bienestar.
          </p>

          <p className="mt-4 max-w-xl leading-8 text-[#6E5648]">
            Mi propósito es ofrecer un acompañamiento que no solo escuche lo que
            estás viviendo, sino que también te ayude a comprenderlo, trabajarlo
            y transformarlo con mayor claridad y consciencia.
          </p>

          <a
            href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20conocer%20m%C3%A1s%20sobre%20tu%20acompa%C3%B1amiento%20en%20Lorena%20Wellness%20TuPsico."
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C]"
          >
            Quiero conocerte más
          </a>
        </div>

        <div className="rounded-[2.4rem] bg-[#EEDFD0] p-6 shadow-sm md:p-8">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Lorena Wellness TuPsico
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight">
              Un espacio creado para acompañarte con calidez y dirección
            </h2>

            <p className="mt-5 leading-8 text-[#6E5648]">
              Este proyecto nace con la intención de ofrecer un lugar seguro,
              humano y profesional, donde el bienestar emocional sea abordado
              con profundidad, cercanía y herramientas prácticas para la vida
              real.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F6EFE8] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
              Mi enfoque
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Cómo entiendo el acompañamiento terapéutico
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#6E5648]">
              Creo en un proceso terapéutico que combine escucha, comprensión,
              intervención y herramientas prácticas para ayudarte a avanzar con
              mayor claridad emocional.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] bg-[#FFFDFC] p-8 shadow-sm">
              <p className="text-sm font-semibold text-[#8C5A3C]">01</p>
              <h3 className="mt-4 text-2xl font-semibold">Escucha humana</h3>
              <p className="mt-4 leading-8 text-[#6E5648]">
                Un espacio donde puedas sentirte vista, escuchada y acompañada
                sin juicio.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#FFFDFC] p-8 shadow-sm">
              <p className="text-sm font-semibold text-[#8C5A3C]">02</p>
              <h3 className="mt-4 text-2xl font-semibold">
                Dirección terapéutica
              </h3>
              <p className="mt-4 leading-8 text-[#6E5648]">
                Un proceso guiado con intención, claridad y herramientas útiles
                para tu realidad.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#FFFDFC] p-8 shadow-sm">
              <p className="text-sm font-semibold text-[#8C5A3C]">03</p>
              <h3 className="mt-4 text-2xl font-semibold">Mirada integral</h3>
              <p className="mt-4 leading-8 text-[#6E5648]">
                Un acompañamiento que contempla emociones, historia personal,
                bienestar y crecimiento consciente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
              Qué encontrarás aquí
            </p>

            <ul className="mt-6 space-y-4 text-[#6E5648]">
              <li>• Acompañamiento terapéutico con enfoque humano y profesional.</li>
              <li>• Herramientas prácticas para aplicar a tu vida diaria.</li>
              <li>• Recursos emocionales para complementar tu proceso.</li>
              <li>• Un espacio orientado al bienestar y crecimiento personal.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
              Mi intención contigo
            </p>

            <p className="mt-6 leading-8 text-[#6E5648]">
              Que este espacio pueda servirte como un punto de apoyo para
              comprenderte mejor, fortalecer tu bienestar emocional y avanzar en
              tu proceso con más consciencia, dirección y cuidado personal.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F3E7DA] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Contacto
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Si conectas con este espacio, podemos dar el siguiente paso
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#6E5648]">
            Escríbeme por WhatsApp y conversemos sobre el acompañamiento que
            mejor puede ayudarte en este momento.
          </p>

          <a
            href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20conocer%20m%C3%A1s%20sobre%20tu%20acompa%C3%B1amiento%20en%20Lorena%20Wellness%20TuPsico."
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C]"
          >
            Escribirme por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}