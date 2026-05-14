import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF6F1] px-6 py-20 text-[#4E3427] md:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
          Página no encontrada
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
          Esta página no está disponible
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6E5648]">
          Es posible que la dirección haya cambiado, que la página ya no exista
          o que el enlace no sea válido.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-[#C97B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B96E4C]"
          >
            Ir al dashboard
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#DED2C5] bg-white px-6 py-3 text-sm font-medium text-[#4E3427] transition hover:bg-[#F6EFE8]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}