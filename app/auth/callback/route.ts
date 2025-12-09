import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      if (data.user.email === "odibrix@gmail.com") {
        return NextResponse.redirect(`${origin}/admin`)
      }

      // Check user role from metadata
      const role = data.user.user_metadata?.role
      if (role === "agent") {
        return NextResponse.redirect(`${origin}/agent/dashboard`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?message=Could not authenticate with Google`)
}
