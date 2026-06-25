import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8DCCF] bg-[#FAF6F1]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="min-w-0">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
              Lorena Wellness TuPsico
            </p>
            <p className="mt-1 text-xs text-[#6E5648]">
              Psicología clínica y acompañamiento online
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#servicios"
            className="text-sm text-[#4E3427] transition hover:text-[#8C5A3C]"
          >
            Servicios
          </a>
          <a
            href="#acompanamiento"
            className="text-sm text-[#4E3427] transition hover:text-[#8C5A3C]"
          >
            Proceso
          </a>
          <a
            href="#testimonios"
            className="text-sm text-[#4E3427] transition hover:text-[#8C5A3C]"
          >
            Enfoque
          </a>
          <a
            href="#contacto"
            className="text-sm text-[#4E3427] transition hover:text-[#8C5A3C]"
          >
            Contacto
          </a>
          <Link
            href="/login"
            className="rounded-full border border-[#DED2C5] bg-white px-4 py-2 text-sm font-medium text-[#4E3427] transition hover:bg-[#F6EFE8]"
          >
            Ingresar
          </Link>
        </nav>
      </div>
    </header>
  );
}