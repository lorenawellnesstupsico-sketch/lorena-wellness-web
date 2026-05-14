export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#DED2C5] bg-[#FAF6F1]/90 backdrop-blur">
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
          <a href="/login" className="transition hover:text-[#C97B57]">
            Ingresar
          </a>
        </nav>
      </div>
    </header>
  );
}