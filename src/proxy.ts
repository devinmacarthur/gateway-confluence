import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require authentication
const PROTECTED_PATHS = [
  "/community/forum/new",
  "/community/mutual-aid/new",
  "/profile",
];

// Routes that redirect authenticated users away
const AUTH_PATHS = ["/auth/login", "/auth/signup"];

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // If no Supabase URL configured, skip auth (dev without Supabase)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  // Create Supabase client that reads/writes cookies on request + response
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

  // Refresh the session (must call getUser, not getSession)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect routes
  const isProtectedPath = PROTECTED_PATHS.some((p) =>
    pathname.startsWith(p)
  );
  const isAuthPath = AUTH_PATHS.some((p) =>
    pathname.startsWith(p)
  );

  if (isProtectedPath && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && user) {
    return NextResponse.redirect(
      new URL("/community", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
