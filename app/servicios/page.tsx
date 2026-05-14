export default function ServiciosPage() {
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
            <a href="/#contacto" className="transition hover:text-[#C97B57]">
              Contacto
            </a>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
          Servicios
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Acompañamiento terapéutico y recursos para tu bienestar emocional
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#6E5648]">
          Aquí encontrarás espacios y recursos diseñados para ayudarte a
          comprender lo que vives, trabajar en tu bienestar emocional y avanzar
          con mayor claridad, estructura y acompañamiento profesional.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-10">
        <div className="grid gap-8">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm md:p-10">
            <p className="inline-flex rounded-full bg-[#F6EFE8] px-4 py-2 text-sm font-medium text-[#8C5A3C]">
              Acompañamiento personal
            </p>

            <h2 className="mt-6 text-3xl font-bold">Terapia individual</h2>

            <p className="mt-4 max-w-3xl leading-8 text-[#6E5648]">
              Un espacio terapéutico pensado para acompañarte en procesos de
              ansiedad, autoestima, límites, duelos, identidad, autoconocimiento
              y fortalecimiento emocional desde una mirada humana e integral.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[#FAF6F1] p-5">
                <h3 className="font-semibold">Ideal para trabajar</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                  Ansiedad, sobrecarga emocional, autoestima, identidad, límites
                  y procesos de cambio personal.
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF6F1] p-5">
                <h3 className="font-semibold">Enfoque</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                  Escucha, comprensión, intervención terapéutica y herramientas
                  prácticas para tu vida diaria.
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF6F1] p-5">
                <h3 className="font-semibold">Modalidad</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                  Atención online con acompañamiento profesional y seguimiento
                  del proceso.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20informaci%C3%B3n%20sobre%20la%20terapia%20individual%20con%20Lorena%20Wellness%20TuPsico."
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C]"
            >
              Solicitar información
            </a>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm md:p-10">
            <p className="inline-flex rounded-full bg-[#F6EFE8] px-4 py-2 text-sm font-medium text-[#8C5A3C]">
              Vínculo y conexión
            </p>

            <h2 className="mt-6 text-3xl font-bold">Terapia de pareja</h2>

            <p className="mt-4 max-w-3xl leading-8 text-[#6E5648]">
              Un espacio de acompañamiento para parejas que desean fortalecer su
              comunicación, revisar dinámicas del vínculo, trabajar conflictos y
              construir una relación más consciente y saludable.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[#FAF6F1] p-5">
                <h3 className="font-semibold">Ideal para trabajar</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                  Comunicación, conflictos frecuentes, límites, confianza,
                  conexión emocional y reconstrucción del vínculo.
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF6F1] p-5">
                <h3 className="font-semibold">Enfoque</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                  Comprensión mutua, guía estructurada y herramientas para
                  favorecer conversaciones más sanas y conscientes.
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF6F1] p-5">
                <h3 className="font-semibold">Modalidad</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                  Atención online para parejas que buscan acompañamiento
                  profesional en su proceso relacional.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20informaci%C3%B3n%20sobre%20la%20terapia%20de%20pareja%20con%20Lorena%20Wellness%20TuPsico."
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C]"
            >
              Solicitar información
            </a>
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm md:p-10">
            <p className="inline-flex rounded-full bg-[#F6EFE8] px-4 py-2 text-sm font-medium text-[#8C5A3C]">
              Apoyo complementario
            </p>

            <h2 className="mt-6 text-3xl font-bold">Recursos digitales</h2>

            <p className="mt-4 max-w-3xl leading-8 text-[#6E5648]">
              Materiales diseñados para acompañar tu proceso fuera de sesión:
              ebooks, herramientas prácticas y recursos de apoyo que fortalecen
              la reflexión, la claridad y el trabajo personal.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[#FAF6F1] p-5">
                <h3 className="font-semibold">Incluye</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                  Ebooks, ejercicios, material psicoeducativo y recursos de
                  acompañamiento emocional.
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF6F1] p-5">
                <h3 className="font-semibold">Objetivo</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                  Profundizar el proceso personal y ofrecer herramientas
                  concretas para seguir avanzando.
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF6F1] p-5">
                <h3 className="font-semibold">Acceso</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5648]">
                  Disponibles como complemento terapéutico y como apoyo para el
                  crecimiento personal.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20informaci%C3%B3n%20sobre%20los%20recursos%20digitales%20de%20Lorena%20Wellness%20TuPsico."
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C]"
            >
              Solicitar información
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#F3E7DA] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Contacto
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            ¿No sabes cuál servicio es mejor para ti?
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#6E5648]">
            Escríbeme por WhatsApp y conversemos sobre el acompañamiento que más
            puede ayudarte según el momento que estás viviendo.
          </p>

          <a
            href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20orientaci%C3%B3n%20para%20saber%20qu%C3%A9%20servicio%20de%20Lorena%20Wellness%20TuPsico%20es%20mejor%20para%20m%C3%AD."
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