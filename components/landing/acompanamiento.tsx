export function Acompanamiento() {
  return (
    <section
      id="acompanamiento"
      className="border-y border-[#E8DCCF] bg-[linear-gradient(180deg,#F8F1EA_0%,#FAF6F1_100%)]"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:px-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
            Cómo funciona
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            Un proceso más claro, visible y acompañable.
          </h2>
          <p className="mt-5 leading-8 text-[#6E5648]">
            La plataforma no busca reemplazar el encuentro terapéutico, sino dar
            continuidad a lo que trabajas en él para que tu proceso no quede
            aislado entre una sesión y otra.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#8C5A3C]">
              1. Accedes a tu espacio privado
            </p>
            <p className="mt-2 leading-8 text-[#6E5648]">
              Ingresas a una plataforma diseñada para reunir tu proceso, tus
              sesiones y tus materiales de apoyo en un mismo lugar.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#8C5A3C]">
              2. Mantienes claridad sobre tu proceso
            </p>
            <p className="mt-2 leading-8 text-[#6E5648]">
              Puedes revisar tu enfoque actual, el objetivo principal y el paso
              que deseas sostener con más presencia.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[#E7D8C8] bg-[#FFFDFC] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#8C5A3C]">
              3. Organizas tus sesiones y recursos
            </p>
            <p className="mt-2 leading-8 text-[#6E5648]">
              Tienes a la mano tus sesiones, tu historial y recursos útiles para
              seguir acompañándote con intención.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}