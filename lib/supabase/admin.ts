import "server-only";

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Falta la variable NEXT_PUBLIC_SUPABASE_URL en el archivo .env.local.",
    );
  }

  if (!supabaseSecretKey) {
    throw new Error(
      "Falta la variable SUPABASE_SECRET_KEY en el archivo .env.local.",
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}