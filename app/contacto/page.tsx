export default function ContactoPage() {
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
            <a href="/contacto" className="transition hover:text-[#C97B57]">
              Contacto
            </a>
          </nav>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Contacto
          </p>

          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight md:text-6xl">
            Estoy aquí para acompañarte en tu proceso
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6E5648]">
            Si sientes que es momento de empezar, de pedir apoyo o de conocer
            mejor el acompañamiento que puedo ofrecerte, este puede ser tu
            primer paso.
          </p>

          <p className="mt-4 max-w-xl leading-8 text-[#6E5648]">
            Escríbeme y conversemos sobre lo que estás viviendo, el tipo de
            apoyo que necesitas y la mejor manera de orientarte en este momento.
          </p>

          <a
            href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20ponerme%20en%20contacto%20con%20Lorena%20Wellness%20TuPsico."
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C]"
          >
            Escribirme por WhatsApp
          </a>
        </div>

        <div className="rounded-[2.4rem] bg-[#EEDFD0] p-6 shadow-sm md:p-8">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Información de contacto
            </p>

            <div className="mt-6 space-y-6 text-[#6E5648]">
              <div>
                <p className="font-semibold text-[#4E3427]">WhatsApp</p>
                <p className="mt-1">+57 322 930 1341</p>
              </div>

              <div>
                <p className="font-semibold text-[#4E3427]">Modalidad</p>
                <p className="mt-1">Atención online</p>
              </div>

              <div>
                <p className="font-semibold text-[#4E3427]">
                  Tipo de acompañamiento
                </p>
                <p className="mt-1">
                  Procesos individuales, terapia de pareja y recursos digitales
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#4E3427]">Primer contacto</p>
                <p className="mt-1">
                  Puedes escribirme directamente para recibir orientación inicial
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F6EFE8] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
              Antes de escribir
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Qué puedes contarme en tu primer mensaje
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#6E5648]">
              No necesitas tener todo claro para escribir. Puedes comenzar
              contándome lo básico para orientarte mejor.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] bg-[#FFFDFC] p-8 shadow-sm">
              <p className="text-sm font-semibold text-[#8C5A3C]">01</p>
              <h3 className="mt-4 text-2xl font-semibold">Qué estás viviendo</h3>
              <p className="mt-4 leading-8 text-[#6E5648]">
                Puedes contarme brevemente qué situación o proceso emocional te
                gustaría trabajar.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#FFFDFC] p-8 shadow-sm">
              <p className="text-sm font-semibold text-[#8C5A3C]">02</p>
              <h3 className="mt-4 text-2xl font-semibold">Qué necesitas hoy</h3>
              <p className="mt-4 leading-8 text-[#6E5648]">
                Si buscas orientación, iniciar terapia o conocer qué servicio
                puede ayudarte mejor.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#FFFDFC] p-8 shadow-sm">
              <p className="text-sm font-semibold text-[#8C5A3C]">03</p>
              <h3 className="mt-4 text-2xl font-semibold">Cómo prefieres empezar</h3>
              <p className="mt-4 leading-8 text-[#6E5648]">
                Puedes escribirme con total naturalidad y desde ahí te orientaré
                sobre el siguiente paso.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
          Da el primer paso
        </p>

        <h2 className="mt-4 text-3xl font-bold md:text-5xl">
          Tu proceso puede empezar con un mensaje
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6E5648]">
          No tienes que tener todo resuelto para empezar. A veces, el primer
          paso es simplemente abrir la conversación.
        </p>

        <a
          href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20ponerme%20en%20contacto%20con%20Lorena%20Wellness%20TuPsico."
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C]"
        >
          Hablar por WhatsApp
        </a>
      </section>
    </main>
  );
}