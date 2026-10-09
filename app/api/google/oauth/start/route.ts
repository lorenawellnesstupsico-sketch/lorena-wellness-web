import { NextRequest, NextResponse } from "next/server";

import { requirePsychologist } from "@/lib/auth/require-psychologist";

export const runtime = "nodejs";

const GOOGLE_AUTH_URL =
  "https://accounts.google.com/o/oauth2/v2/auth";

const GOOGLE_CALENDAR_SCOPE =
  "https://www.googleapis.com/auth/calendar.events";

const OAUTH_STATE_COOKIE =
  "tupsico_google_oauth_state";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "https://lorena-wellness-web.vercel.app",
]);

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

export async function GET(
  request: NextRequest,
) {
  await requirePsychologist();

  const clientId =
    process.env.GOOGLE_OAUTH_CLIENT_ID;

  if (!clientId) {
    console.error(
      "GOOGLE_OAUTH_CLIENT_ID no está configurado.",
    );

    return NextResponse.redirect(
      new URL(
        "/dashboard?google_calendar=config_error",
        request.url,
      ),
    );
  }

  let redirectUri: string;

  try {
    redirectUri =
      getRedirectUri(request);
  } catch (error) {
    console.error(
      "Error construyendo redirect URI de Google:",
      error,
    );

    return NextResponse.redirect(
      new URL(
        "/dashboard?google_calendar=origin_error",
        request.url,
      ),
    );
  }

  const state =
    crypto.randomUUID();

  const authorizationUrl =
    new URL(GOOGLE_AUTH_URL);

  authorizationUrl.searchParams.set(
    "client_id",
    clientId,
  );

  authorizationUrl.searchParams.set(
    "redirect_uri",
    redirectUri,
  );

  authorizationUrl.searchParams.set(
    "response_type",
    "code",
  );

  authorizationUrl.searchParams.set(
    "scope",
    GOOGLE_CALENDAR_SCOPE,
  );

  authorizationUrl.searchParams.set(
    "access_type",
    "offline",
  );

  authorizationUrl.searchParams.set(
    "include_granted_scopes",
    "true",
  );

  authorizationUrl.searchParams.set(
    "prompt",
    "consent select_account",
  );

  authorizationUrl.searchParams.set(
    "state",
    state,
  );

  const response =
    NextResponse.redirect(
      authorizationUrl,
    );

  response.cookies.set(
    OAUTH_STATE_COOKIE,
    state,
    {
      httpOnly: true,
      secure:
        request.nextUrl.protocol ===
        "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    },
  );

  return response;
}