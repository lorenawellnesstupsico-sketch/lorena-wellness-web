"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#FAF6F1] px-6 py-20 text-[#4E3427] md:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
          Ocurrió un problema
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
          No pudimos cargar esta sección
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6E5648]">
          Hubo un inconveniente al cargar esta parte de tu espacio privado.
          Puedes intentarlo nuevamente.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-full bg-[#C97B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B96E4C]"
          >
            Reintentar
          </button>

          <a
            href="/dashboard"
            className="rounded-full border border-[#DED2C5] bg-white px-6 py-3 text-sm font-medium text-[#4E3427] transition hover:bg-[#F6EFE8]"
          >
            Volver al dashboard
          </a>
        </div>
      </div>
    </main>
  );
}