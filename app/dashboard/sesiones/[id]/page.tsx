import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrivateNav } from "@/components/dashboard/private-nav";
import { DeleteSessionButton } from "@/components/dashboard/delete-session-button";
import { actualizarSesion, eliminarSesion } from "../actions";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ success?: string; error?: string }>;
};

export default async function EditarSesionPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const success = resolvedSearchParams?.success;
  const errorMessage = resolvedSearchParams?.error
    ? decodeURIComponent(resolvedSearchParams.error)
    : "";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: sesion, error } = await supabase
    .from("sesiones")
    .select("id, titulo, fecha, hora, estado, notas, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !sesion) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#4E3427]">
      <section className="border-b border-[#DED2C5] bg-[#FAF6F1]/95">
        <div className="mx-auto max-w-6xl px-6 py-5 md:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
                Lorena Wellness TuPsico
              </p>
              <p className="mt-1 text-sm text-[#6E5648]">Editar sesión</p>
            </div>

            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-[#DED2C5] bg-white px-5 py-2.5 text-sm text-[#4E3427] transition hover:bg-[#F6EFE8]"
              >
                Cerrar sesión
              </button>
            </form>
          </div>

          <PrivateNav />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8C5A3C]">
          Sesiones
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
          Editar sesión
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6E5648]">
          Aquí puedes actualizar la información de esta sesión y mantener tu
          organización al día.
        </p>

        {success === "updated" ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#D9CBBE] bg-[#F3E7DA] px-5 py-4 text-sm text-[#6E5648]">
            Los cambios de esta sesión se guardaron correctamente.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#E7C9C1] bg-[#FFF3F0] px-5 py-4 text-sm text-[#8A4B38]">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-10 rounded-[2rem] border border-[#E7D8C8] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C5A3C]">
            Información de la sesión
          </p>

          <h2 className="mt-4 text-2xl font-semibold">
            Ajusta los datos cuando lo necesites
          </h2>

          <form action={actualizarSesion} className="mt-6 grid gap-5 md:grid-cols-2">
            <input type="hidden" name="id" value={sesion.id} />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Título de la sesión
              </label>
              <input
                name="titulo"
                type="text"
                required
                defaultValue={sesion.titulo || ""}
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
                defaultValue={sesion.fecha || ""}
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
                defaultValue={sesion.hora || ""}
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4E3427]">
                Estado
              </label>
              <select
                name="estado"
                defaultValue={sesion.estado || "pendiente"}
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
                rows={5}
                defaultValue={sesion.notas || ""}
                className="w-full rounded-2xl border border-[#DED2C5] bg-white px-4 py-3 outline-none transition focus:border-[#C97B57]"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-[#C97B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B96E4C]"
              >
                Guardar cambios
              </button>

              <a
                href="/dashboard/sesiones"
                className="rounded-full border border-[#DED2C5] bg-white px-6 py-3 text-sm font-medium text-[#4E3427] transition hover:bg-[#F6EFE8]"
              >
                Volver
              </a>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[#E7D8C8] bg-[#FFF7F2] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B85C38]">
            Zona sensible
          </p>

          <h2 className="mt-4 text-2xl font-semibold text-[#4E3427]">
            Eliminar esta sesión
          </h2>

          <p className="mt-4 max-w-2xl leading-8 text-[#6E5648]">
            Esta acción eliminará la sesión de tu historial. Hazlo solo si estás
            segura de que ya no la necesitas.
          </p>

          <form action={eliminarSesion} className="mt-6">
            <input type="hidden" name="id" value={sesion.id} />
            <DeleteSessionButton />
          </form>
        </div>
      </section>
    </main>
  );
}