"use server"

import { createClient } from "@/lib/supabase/server"

export async function getTestimonials(featured?: boolean) {
  const supabase = await createClient()

  let query = supabase.from("testimonials").select("*").eq("is_approved", true)

  if (featured) {
    query = query.eq("is_featured", true)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching testimonials:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
