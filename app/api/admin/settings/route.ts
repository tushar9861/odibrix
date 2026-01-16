import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify user is admin
    const { data: admin } = await supabase.from("admins").select("id").eq("user_id", user.id).single()

    if (!admin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { type, settings } = body

    if (type === "contact") {
      // Store in a settings table or metadata
      const { error } = await supabase.from("admin_settings").upsert(
        {
          key: "contact",
          value: settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      )

      if (error) throw error

      return NextResponse.json({ success: true, message: "Contact settings saved" })
    } else if (type === "pricing") {
      const { error } = await supabase.from("admin_settings").upsert(
        {
          key: "pricing",
          value: settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      )

      if (error) throw error

      return NextResponse.json({ success: true, message: "Pricing saved" })
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Settings API error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
