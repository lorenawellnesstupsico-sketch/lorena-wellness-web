import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = encodeURIComponent(
      "No fue posible iniciar sesión. Verifica tus datos."
    );
    return NextResponse.redirect(new URL(`/login?error=${message}`, request.url));
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}