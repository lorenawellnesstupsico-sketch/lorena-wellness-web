"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function buildErrorRedirect(path: string, message: string): never {
  const safeMessage = encodeURIComponent(message);
  redirect(`${path}?error=${safeMessage}`);
}

export async function crearSesion(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    buildErrorRedirect(
      "/dashboard/sesiones",
      "Tu sesión expiró. Ingresa nuevamente."
    );
  }

  const titulo = String(formData.get("titulo") || "").trim();
  const fecha = String(formData.get("fecha") || "").trim();
  const hora = String(formData.get("hora") || "").trim();
  const estado = String(formData.get("estado") || "").trim();
  const notas = String(formData.get("notas") || "").trim();

  if (!titulo) {
    buildErrorRedirect(
      "/dashboard/sesiones",
      "El título de la sesión es obligatorio."
    );
  }

  const { error } = await supabase.from("sesiones").insert({
    user_id: user.id,
    titulo,
    fecha: fecha || null,
    hora: hora || null,
    estado: estado || "pendiente",
    notas: notas || null,
  });

  if (error) {
    buildErrorRedirect(
      "/dashboard/sesiones",
      "No pudimos guardar la sesión. Inténtalo otra vez."
    );
  }

  revalidatePath("/dashboard/sesiones");
  redirect("/dashboard/sesiones?success=created");
}

export async function actualizarSesion(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    buildErrorRedirect(
      "/dashboard/sesiones",
      "Tu sesión expiró. Ingresa nuevamente."
    );
  }

  const id = String(formData.get("id") || "").trim();
  const titulo = String(formData.get("titulo") || "").trim();
  const fecha = String(formData.get("fecha") || "").trim();
  const hora = String(formData.get("hora") || "").trim();
  const estado = String(formData.get("estado") || "").trim();
  const notas = String(formData.get("notas") || "").trim();

  if (!id) {
    buildErrorRedirect(
      "/dashboard/sesiones",
      "No encontramos la sesión que quieres actualizar."
    );
  }

  if (!titulo) {
    buildErrorRedirect(
      `/dashboard/sesiones/${id}`,
      "El título de la sesión es obligatorio."
    );
  }

  const { error } = await supabase
    .from("sesiones")
    .update({
      titulo,
      fecha: fecha || null,
      hora: hora || null,
      estado: estado || "pendiente",
      notas: notas || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    buildErrorRedirect(
      `/dashboard/sesiones/${id}`,
      "No pudimos actualizar la sesión. Inténtalo nuevamente."
    );
  }

  revalidatePath("/dashboard/sesiones");
  revalidatePath(`/dashboard/sesiones/${id}`);
  redirect(`/dashboard/sesiones/${id}?success=updated`);
}

export async function eliminarSesion(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    buildErrorRedirect(
      "/dashboard/sesiones",
      "Tu sesión expiró. Ingresa nuevamente."
    );
  }

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    buildErrorRedirect(
      "/dashboard/sesiones",
      "No encontramos la sesión que quieres eliminar."
    );
  }

  const { error } = await supabase
    .from("sesiones")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    buildErrorRedirect(
      `/dashboard/sesiones/${id}`,
      "No pudimos eliminar la sesión. Inténtalo otra vez."
    );
  }

  revalidatePath("/dashboard/sesiones");
  revalidatePath(`/dashboard/sesiones/${id}`);
  redirect("/dashboard/sesiones?success=deleted");
}