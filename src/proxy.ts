import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

// Routes that require authentication (matched after stripping locale prefix)
const PROTECTED_PATHS = [
  "/community/forum/new",
  "/community/mutual-aid/new",
  "/profile",
];

// Routes that redirect authenticated users away
const AUTH_PATHS = ["/auth/login", "/auth/signup"];

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Step 1: Run i18n middleware
  const response = intlMiddleware(request);

  // Step 2: If no Supabase URL configured, skip auth (dev without Supabase)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  // Step 3: Create Supabase client that reads/writes cookies on request + response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Step 4: Refresh the session (must call getUser, not getSession)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Step 5: Extract pathname without locale prefix
  const pathname = request.nextUrl.pathname;
  const localePattern = /^\/(en|es|vi|zh|ru)(\/|$)/;
  const pathWithoutLocale = pathname.replace(localePattern, "/");

  // Step 6: Protect routes
  const isProtectedPath = PROTECTED_PATHS.some((p) =>
    pathWithoutLocale.startsWith(p)
  );
  const isAuthPath = AUTH_PATHS.some((p) =>
    pathWithoutLocale.startsWith(p)
  );

  if (isProtectedPath && !user) {
    const localeMatch = pathname.match(localePattern);
    const locale = localeMatch ? localeMatch[1] : "";
    const prefix = locale ? `/${locale}` : "";
    const loginUrl = new URL(`${prefix}/auth/login`, request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && user) {
    const localeMatch = pathname.match(localePattern);
    const locale = localeMatch ? localeMatch[1] : "";
    const prefix = locale ? `/${locale}` : "";
    return NextResponse.redirect(
      new URL(`${prefix}/community`, request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
