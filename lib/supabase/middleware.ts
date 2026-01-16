import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith("/api") || pathname.startsWith("/_next/static")) {
    return NextResponse.next({
      request,
    })
  }

  // Don't call getUser on every request - only on protected routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/agent") || pathname.startsWith("/owner")) {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          },
        },
      },
    )

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Protect admin routes
      if (pathname.startsWith("/admin") && !user) {
        const url = request.nextUrl.clone()
        url.pathname = "/auth/login"
        return NextResponse.redirect(url)
      }

      // Protect agent routes
      if (pathname.startsWith("/agent") && !user) {
        const url = request.nextUrl.clone()
        url.pathname = "/auth/login"
        return NextResponse.redirect(url)
      }

      // Protect owner routes
      if (pathname.startsWith("/owner") && !user) {
        const url = request.nextUrl.clone()
        url.pathname = "/auth/login"
        return NextResponse.redirect(url)
      }
    } catch (error) {
      // If auth check fails, allow request to continue (client will handle redirect)
      console.error("[v0] Middleware auth check error:", error)
    }

    return supabaseResponse
  }

  // For public routes, just refresh the session without auth check
  return NextResponse.next({
    request,
  })
}
