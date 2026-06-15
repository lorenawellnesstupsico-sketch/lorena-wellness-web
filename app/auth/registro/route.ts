import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    const message = encodeURIComponent(
      "No fue posible crear la cuenta. Inténtalo nuevamente."
    );
    return NextResponse.redirect(
      new URL(`/registro?error=${message}`, request.url)
    );
  }

  const success = encodeURIComponent(
    "Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión."
  );

  return NextResponse.redirect(
    new URL(`/registro?success=${success}`, request.url)
  );
}