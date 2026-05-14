"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function buildErrorRedirect(path: string, message: string): never {
  const safeMessage = encodeURIComponent(message);
  redirect(`${path}?error=${safeMessage}`);
}

export async function guardarProceso(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    buildErrorRedirect(
      "/dashboard/proceso",
      "Tu sesión expiró. Ingresa nuevamente."
    );
  }

  const enfoque_actual = String(formData.get("enfoque_actual") || "").trim();
  const objetivo_principal = String(
    formData.get("objetivo_principal") || ""
  ).trim();
  const trabajo_actual = String(formData.get("trabajo_actual") || "").trim();
  const siguiente_paso = String(formData.get("siguiente_paso") || "").trim();
  const recordatorio_terapeutico = String(
    formData.get("recordatorio_terapeutico") || ""
  ).trim();

  const { data: existente, error: errorBusqueda } = await supabase
    .from("procesos")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errorBusqueda) {
    buildErrorRedirect(
      "/dashboard/proceso",
      "No pudimos cargar tu proceso actual."
    );
  }

  if (existente?.id) {
    const { error: errorUpdate } = await supabase
      .from("procesos")
      .update({
        enfoque_actual: enfoque_actual || null,
        objetivo_principal: objetivo_principal || null,
        trabajo_actual: trabajo_actual || null,
        siguiente_paso: siguiente_paso || null,
        recordatorio_terapeutico: recordatorio_terapeutico || null,
      })
      .eq("id", existente.id)
      .eq("user_id", user.id);

    if (errorUpdate) {
      buildErrorRedirect(
        "/dashboard/proceso",
        "No pudimos guardar los cambios del proceso."
      );
    }
  } else {
    const { error: errorInsert } = await supabase.from("procesos").insert({
      user_id: user.id,
      enfoque_actual: enfoque_actual || null,
      objetivo_principal: objetivo_principal || null,
      trabajo_actual: trabajo_actual || null,
      siguiente_paso: siguiente_paso || null,
      recordatorio_terapeutico: recordatorio_terapeutico || null,
    });

    if (errorInsert) {
      buildErrorRedirect(
        "/dashboard/proceso",
        "No pudimos crear la información de tu proceso."
      );
    }
  }

  revalidatePath("/dashboard/proceso");
  redirect("/dashboard/proceso?success=saved");
}