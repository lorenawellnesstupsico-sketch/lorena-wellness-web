import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="border-b border-[#E8DCCF] bg-[linear-gradient(180deg,#FAF6F1_0%,#F7F0E8_100%)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex items-center">
          <div className="w-full rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm md:p-8">
            <div className="overflow-hidden rounded-[1.75rem]">
              <Image
                src="/lorena-olarte.jpg"
                alt="Lorena Olarte, fundadora de Lorena Wellness TuPsico"
                width={900}
                height={1100}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="mt-5">
              <p className="text-2xl font-semibold text-[#4E3427]">
                Lorena Olarte
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#8C5A3C]">
                Psicóloga clínica · Fundadora de Lorena Wellness TuPsico
              </p>
              <p className="mt-4 leading-8 text-[#6E5648]">
                Un espacio creado para acompañar procesos emocionales con más
                claridad, estructura y cercanía.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-[2rem] border border-[#E2CDBB] bg-[linear-gradient(135deg,#FFF8F2_0%,#F5E6DA_100%)] p-8 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
              Lorena Wellness TuPsico
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Más que una sesión, una experiencia de acompañamiento con sentido.
            </h1>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contacto"
                className="rounded-full bg-[#C97B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B96E4C]"
              >
                Agenda tu valoración 
              </a>

              <Link
                href="/login"
                className="rounded-full border border-[#DED2C5] bg-white px-6 py-3 text-sm font-medium text-[#4E3427] transition hover:bg-[#F6EFE8]"
              >
                Ingresar a mi espacio
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="flex min-h-[190px] flex-col rounded-[1.5rem] border border-[#E7D8C8] bg-white/85 p-5">
                <p className="text-base font-semibold text-[#8C5A3C]">
                  Modalidad online
                </p>
                <p className="mt-3 text-sm leading-7 text-[#6E5648]">
                  Atención desde un espacio seguro, cómodo y accesible.
                </p>
              </div>

              <div className="flex min-h-[190px] flex-col rounded-[1.5rem] border border-[#E7D8C8] bg-white/85 p-5">
                <p className="text-base font-semibold text-[#8C5A3C]">
                  Proceso con estructura
                </p>
                <p className="mt-3 text-sm leading-7 text-[#6E5648]">
                  Seguimiento claro de objetivos, sesiones y recursos.
                </p>
              </div>

              <div className="flex min-h-[190px] flex-col rounded-[1.5rem] border border-[#E7D8C8] bg-white/85 p-5">
                <p className="text-base font-semibold text-[#8C5A3C]">
                  Enfoque humano
                </p>
                <p className="mt-3 text-sm leading-7 text-[#6E5648]">
                  Cercanía emocional con una mirada profesional y consciente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}