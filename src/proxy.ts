import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No Supabase → pass through (mock/dev mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session — must be called before any route checks
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Resolve role from profiles table (not user_metadata)
  let role = "employee";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? "employee";
  }

  // /login: redirect authenticated users to their portal
  if (pathname === "/login") {
    if (user) {
      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin" : "/empleado", request.url)
      );
    }
    return supabaseResponse;
  }

  // All other protected routes: require auth
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Employees cannot access /admin/*
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/empleado", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
