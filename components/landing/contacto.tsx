export function Contacto() {
  return (
    <section
      id="contacto"
      className="border-t border-[#E8DCCF] bg-[linear-gradient(180deg,#F8F1EA_0%,#FAF6F1_100%)]"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:px-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Contacto
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Si sientes que es momento de empezar, este puede ser un buen lugar.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6E5648]">
            Puedes dar el primer paso con calma. La idea es que encuentres un
            espacio serio, humano y ordenado para comenzar a trabajar en ti con
            más claridad.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Próximo paso
          </p>

          <h3 className="mt-4 text-2xl font-semibold">
            Escríbeme directamente por WhatsApp
          </h3>

          <p className="mt-4 leading-8 text-[#6E5648]">
            Si deseas iniciar tu proceso, resolver dudas o conocer cuál plan se
            ajusta mejor a ti, puedes escribirme directamente y con gusto te
            orientaré.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20empezar%20mi%20proceso%20con%20Lorena%20Wellness%20TuPsico%E2%9C%A8%F0%9F%A4%8D"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#C97B57] px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-[#B96E4C]"
            >
              Escribir por WhatsApp
            </a>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-[#E7D8C8] bg-[#F8F1EA] p-5">
            <p className="text-sm font-semibold text-[#4E3427]">
              Atención cercana y personalizada
            </p>
            <p className="mt-3 leading-8 text-[#6E5648]">
              Este es un espacio pensado para acompañarte con claridad,
              estructura y presencia. Dar el primer paso también puede sentirse
              más liviano cuando sabes a dónde acudir.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}