import {
  createClient,
} from "@supabase/supabase-js";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requirePsychologist } from "@/lib/auth/require-psychologist";

export const runtime = "nodejs";

const GOOGLE_TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const OAUTH_STATE_COOKIE =
  "tupsico_google_oauth_state";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "https://lorena-wellness-web.vercel.app",
]);

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
};

function getRedirectUri(
  request: NextRequest,
) {
  const origin =
    request.nextUrl.origin;

  if (!ALLOWED_ORIGINS.has(origin)) {
    throw new Error(
      `Origen OAuth no autorizado: ${origin}`,
    );
  }

  return `${origin}/api/google/oauth/callback`;
}

function redirectToDashboard(
  request: NextRequest,
  status: string,
) {
  return NextResponse.redirect(
    new URL(
      `/dashboard?google_calendar=${encodeURIComponent(
        status,
      )}`,
      request.url,
    ),
  );
}

function clearStateCookie(
  response: NextResponse,
) {
  response.cookies.delete(
    OAUTH_STATE_COOKIE,
  );

  return response;
}

export async function GET(
  request: NextRequest,
) {
  const googleError =
    request.nextUrl.searchParams.get(
      "error",
    );

  if (googleError) {
    console.error(
      "Google OAuth devolvió un error:",
      googleError,
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "authorization_denied",
      ),
    );
  }

  const code =
    request.nextUrl.searchParams.get(
      "code",
    );

  const returnedState =
    request.nextUrl.searchParams.get(
      "state",
    );

  const storedState =
    request.cookies.get(
      OAUTH_STATE_COOKIE,
    )?.value;

  if (
    !returnedState ||
    !storedState ||
    returnedState !== storedState
  ) {
    console.error(
      "Google OAuth state inválido.",
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "invalid_state",
      ),
    );
  }

  if (!code) {
    console.error(
      "Google OAuth no devolvió authorization code.",
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "missing_code",
      ),
    );
  }

  const clientId =
    process.env.GOOGLE_OAUTH_CLIENT_ID;

  const clientSecret =
    process.env
      .GOOGLE_OAUTH_CLIENT_SECRET;

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabaseSecretKey =
    process.env
      .SUPABASE_SECRET_KEY;

  if (
    !clientId ||
    !clientSecret ||
    !supabaseUrl ||
    !supabaseSecretKey
  ) {
    console.error(
      "Faltan variables privadas para Google OAuth o Supabase.",
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "config_error",
      ),
    );
  }

  let redirectUri: string;

  try {
    redirectUri =
      getRedirectUri(request);
  } catch (error) {
    console.error(
      "Error construyendo redirect URI:",
      error,
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "origin_error",
      ),
    );
  }

  const {
    profile,
  } = await requirePsychologist();

  const tokenBody =
    new URLSearchParams({
      client_id: clientId,
      client_secret:
        clientSecret,
      code,
      grant_type:
        "authorization_code",
      redirect_uri:
        redirectUri,
    });

  let tokenResponse: Response;

  try {
    tokenResponse =
      await fetch(
        GOOGLE_TOKEN_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body:
            tokenBody.toString(),
          cache: "no-store",
        },
      );
  } catch (error) {
    console.error(
      "No fue posible contactar Google OAuth:",
      error,
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "token_network_error",
      ),
    );
  }

  const tokenData =
    (await tokenResponse.json()) as GoogleTokenResponse;

  if (
    !tokenResponse.ok ||
    !tokenData.access_token
  ) {
    console.error(
      "Google rechazó el intercambio del código OAuth:",
      {
        status:
          tokenResponse.status,
        error:
          tokenData.error,
        description:
          tokenData.error_description,
      },
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "token_exchange_error",
      ),
    );
  }

  const adminSupabase =
    createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

  const {
    data: existingConnection,
    error: existingConnectionError,
  } = await adminSupabase
    .from(
      "google_calendar_connections",
    )
    .select(
      "refresh_token, connected_at",
    )
    .eq(
      "profile_id",
      profile.id,
    )
    .maybeSingle();

  if (existingConnectionError) {
    console.error(
      "No fue posible consultar la conexión Google existente:",
      existingConnectionError,
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "database_read_error",
      ),
    );
  }

  const refreshToken =
    tokenData.refresh_token ??
    existingConnection?.refresh_token ??
    null;

  if (!refreshToken) {
    console.error(
      "Google no entregó refresh token y no existe uno previo.",
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "missing_refresh_token",
      ),
    );
  }

  const now =
    new Date();

  const accessTokenExpiresAt =
    typeof tokenData.expires_in ===
    "number"
      ? new Date(
          now.getTime() +
            tokenData.expires_in *
              1000,
        ).toISOString()
      : null;

  const {
    error: saveError,
  } = await adminSupabase
    .from(
      "google_calendar_connections",
    )
    .upsert(
      {
        profile_id:
          profile.id,

        provider:
          "google",

        calendar_id:
          "primary",

        access_token:
          tokenData.access_token,

        refresh_token:
          refreshToken,

        access_token_expires_at:
          accessTokenExpiresAt,

        scope:
          tokenData.scope ?? null,

        token_type:
          tokenData.token_type ??
          "Bearer",

        connected_at:
          existingConnection?.connected_at ??
          now.toISOString(),

        updated_at:
          now.toISOString(),
      },
      {
        onConflict:
          "profile_id",
      },
    );

  if (saveError) {
    console.error(
      "No fue posible guardar la conexión Google Calendar:",
      saveError,
    );

    return clearStateCookie(
      redirectToDashboard(
        request,
        "database_save_error",
      ),
    );
  }

  return clearStateCookie(
    redirectToDashboard(
      request,
      "connected",
    ),
  );
}