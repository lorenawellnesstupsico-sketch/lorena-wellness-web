export function Contacto() {
  return (
    <section
      id="contacto"
      className="mx-auto max-w-4xl px-6 py-24 text-center md:px-10"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
        Contacto
      </p>

      <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
        Da el primer paso hacia tu proceso
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6E5648]">
        Si sientes que es momento de empezar a priorizarte, trabajar en tu
        bienestar emocional y construir una relación más sana contigo, este
        puede ser tu punto de partida.
      </p>

      <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm md:p-10">
        <p className="text-lg font-medium text-[#4E3427]">
          Agenda tu primer contacto por WhatsApp
        </p>

        <p className="mt-4 leading-8 text-[#6E5648]">
          Escríbeme directamente y conversemos sobre el acompañamiento que mejor
          puede ayudarte en este momento.
        </p>

        <a
          href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20empezar%20mi%20proceso%20con%20Lorena%20Wellness%20TuPsico."
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C97B57] px-8 py-3.5 text-white transition hover:bg-[#B96E4C]"
        >
          Escribirme por WhatsApp
        </a>

        <p className="mt-6 text-sm text-[#8C5A3C]">+57 322 930 1341</p>
      </div>
    </section>
  );
}