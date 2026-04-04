import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler.
 * Supabase redirects here after Google authentication with a `code` param.
 * We exchange it for a session then redirect the user into the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // `next` lets us redirect somewhere specific after login (optional)
  const next = searchParams.get("next") ?? "/extract";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — send back to login with a friendly error flag
  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
