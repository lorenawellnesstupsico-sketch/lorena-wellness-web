import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrivateNav } from "@/components/dashboard/private-nav";
import { crearSesion } from "./actions";

type Sesion = {
  id: string;
  titulo: string | null;
  fecha: string | null;
  hora: string | null;
  estado: string | null;
  notas: string | null;
};

type SesionesPageProps = {
  searchParams?: Promise<{ success?: string; error?: string }>;
};

export default async function SesionesPage({
  searchParams,
}: SesionesPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const success = params?.success;
  const error = params?.error ? decodeURIComponent(params.error) : "";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";

  const { data: sesiones } = await supabase
    .from("sesiones")
    .select("id, titulo, fecha, hora, estado, notas")
    .eq("user_id", user.id)
    .order("fecha", { ascending: true });

  const sesionesList = (sesiones as Sesion[] | null) ?? [];
  const proximaSesion = sesionesList[0];
  const historialSesiones = sesionesList.slice(1);

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <section className="border-b border-[#E6D8CB] bg-[linear-gradient(180deg,#FAF6F1_0%,#F7F1EA_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
                Lorena Wellness TuPsico
              </p>
              <p className="mt-2 text-sm text-[#6E5648]">Sesiones privadas</p>
            </div>

            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-[#DED2C5] bg-white px-5 py-2.5 text-sm font-medium text-[#4E3427] transition hover:bg-[#F6EFE8]"
              >
                Cerrar sesión
              </button>
            </form>
          </div>

          <PrivateNav />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="rounded-[2rem] border border-[#E7D8C8] bg-[linear-gradient(135deg,#FFFDFC_0%,#F8EEE4_100%)] p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
            Sesiones
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Un espacio para organizar tu acompañamiento, {displayName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
            Aquí podrás visualizar información real de tus sesiones, mantener
            presente tu proceso y organizar mejor tus próximos encuentros.
          </p>
        </div>

        {success === "created" ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#D9CBBE] bg-[#F3E7DA] px-5 py-4 text-sm text-[#6E5648]">
            La sesión fue creada correctamente.
          </div>
        ) : null}

        {success === "updated" ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#D9CBBE] bg-[#F3E7DA] px-5 py-4 text-sm text-[#6E5648]">
            La sesión fue actualizada correctamente.
          </div>
        ) : null}

        {success === "deleted" ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#D9CBBE] bg-[#F3E7DA] px-5 py-4 text-sm text-[#6E5648]">
            La sesión fue eliminada correctamente.
          </div>
        ) : null}

        {error ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#E7C9C1] bg-[#FFF3F0] px-5 py-4 text-sm text-[#8A4B38]">
            {error}
          </div>
        ) : null}

        <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Registrar nueva sesión
          </p>

          <h2 className="mt-4 text-2xl font-semibold">
            Agrega una nueva sesión desde tu plataforma
          </h2>

          <form action={crearSesion} className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Título de la sesión
              </label>
              <input
                name="titulo"
                type="text"
                required
                placeholder="Ej. Sesión de seguimiento emocional"
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Fecha
              </label>
              <input
                name="fecha"
                type="date"
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Hora
              </label>
              <input
                name="hora"
                type="text"
                placeholder="Ej. 6:00 p. m."
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Estado
              </label>
              <select
                name="estado"
                defaultValue="pendiente"
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              >
                <option value="pendiente">Pendiente</option>
                <option value="programada">Programada</option>
                <option value="confirmada">Confirmada</option>
                <option value="realizada">Realizada</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Notas
              </label>
              <textarea
                name="notas"
                rows={4}
                placeholder="Escribe aquí una nota breve sobre la sesión..."
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-[#C97B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B96E4C]"
              >
                Guardar sesión
              </button>
            </div>
          </form>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Próxima sesión
            </p>

            {proximaSesion ? (
              <div className="mt-5 space-y-4 text-[#6E5648]">
                <h2 className="text-2xl font-semibold text-[#4E3427]">
                  {proximaSesion.titulo || "Sesión sin título"}
                </h2>

                <p>
                  <span className="font-semibold text-[#4E3427]">Fecha:</span>{" "}
                  {proximaSesion.fecha || "Sin fecha"}
                </p>

                <p>
                  <span className="font-semibold text-[#4E3427]">Hora:</span>{" "}
                  {proximaSesion.hora || "Sin hora"}
                </p>

                <p>
                  <span className="font-semibold text-[#4E3427]">Estado:</span>{" "}
                  {proximaSesion.estado || "Sin estado"}
                </p>

                <p className="leading-8">
                  <span className="font-semibold text-[#4E3427]">Notas:</span>{" "}
                  {proximaSesion.notas || "Sin notas registradas"}
                </p>
              </div>
            ) : (
              <div className="mt-5">
                <h2 className="text-2xl font-semibold text-[#4E3427]">
                  Aún no tienes sesiones registradas
                </h2>
                <p className="mt-4 leading-8 text-[#6E5648]">
                  Cuando registres tu primera sesión, aquí podrás visualizar la
                  fecha, la hora, el estado y las notas importantes de tu
                  próximo encuentro.
                </p>

                <div className="mt-6 inline-flex rounded-full bg-[#F3E7DA] px-4 py-2 text-sm font-medium text-[#8C5A3C]">
                  Empieza creando tu primera sesión
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-[#E7D8C8] bg-[#F3E7DA] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
              Recordatorio terapéutico
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              Llegar como estás también está bien
            </h2>

            <p className="mt-4 leading-8 text-[#6E5648]">
              No necesitas tener todo claro antes de una sesión. A veces lo más
              valioso es llegar con honestidad y permitirte explorar lo que hoy
              está presente en ti.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Historial de sesiones
          </p>

          {historialSesiones.length > 0 ? (
            <div className="mt-6 space-y-4">
              {historialSesiones.map((sesion) => (
                <div
                  key={sesion.id}
                  className="rounded-[1.5rem] border border-[#E7D8C8] bg-[#FAF6F1] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-[#4E3427]">
                      {sesion.titulo || "Sesión sin título"}
                    </h3>

                    <a
                      href={`/dashboard/sesiones/${sesion.id}`}
                      className="rounded-full border border-[#DED2C5] bg-white px-4 py-2 text-sm font-medium text-[#4E3427] transition hover:bg-[#F6EFE8]"
                    >
                      Editar
                    </a>
                  </div>

                  <div className="mt-3 space-y-2 text-[#6E5648]">
                    <p>
                      <span className="font-semibold text-[#4E3427]">Fecha:</span>{" "}
                      {sesion.fecha || "Sin fecha"}
                    </p>

                    <p>
                      <span className="font-semibold text-[#4E3427]">Hora:</span>{" "}
                      {sesion.hora || "Sin hora"}
                    </p>

                    <p>
                      <span className="font-semibold text-[#4E3427]">Estado:</span>{" "}
                      {sesion.estado || "Sin estado"}
                    </p>

                    <p className="leading-8">
                      <span className="font-semibold text-[#4E3427]">Notas:</span>{" "}
                      {sesion.notas || "Sin notas registradas"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-[#E7D8C8] bg-[#FAF6F1] p-6">
              <p className="text-lg font-semibold text-[#4E3427]">
                Tu historial aún está empezando
              </p>
              <p className="mt-3 leading-8 text-[#6E5648]">
                A medida que registres más sesiones, aquí podrás ver tu
                recorrido con más claridad y seguimiento.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}