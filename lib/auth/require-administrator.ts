import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AdministratorProfile = {
  id: string;
  full_name: string;
  email: string | null;
  role: "administrator";
  is_active: boolean;
};

export async function requireAdministrator() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  if (!profile.is_active || profile.role !== "administrator") {
    redirect("/dashboard");
  }

  return {
    supabase,
    user,
    profile: profile as AdministratorProfile,
  };
}