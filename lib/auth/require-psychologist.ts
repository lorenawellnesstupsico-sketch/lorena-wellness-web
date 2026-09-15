import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type PsychologistProfile = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: "psychologist";
  is_active: boolean;
};

export async function requirePsychologist() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, phone, role, is_active",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.role !== "psychologist" ||
    profile.is_active !== true
  ) {
    redirect("/dashboard");
  }

  return {
    supabase,
    user,
    profile: profile as PsychologistProfile,
  };
}