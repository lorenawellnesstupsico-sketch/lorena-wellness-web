export function Footer() {
  return (
    <footer className="border-t border-[#DED2C5] bg-[#F3E7DA] px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
            Lorena Wellness TuPsico
          </p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#6E5648]">
            Un espacio de bienestar emocional, acompañamiento terapéutico y
            transformación personal con una mirada humana e integral.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-[#6E5648]">
          <a href="#servicios" className="transition hover:text-[#C97B57]">
            Servicios
          </a>
          <a href="#acompanamiento" className="transition hover:text-[#C97B57]">
            Acompañamiento
          </a>
          <a href="#contacto" className="transition hover:text-[#C97B57]">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}