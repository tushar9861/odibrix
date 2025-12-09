"use server"

import { createClient } from "@/lib/supabase/server"

export async function getProperties(filters?: { type?: string; featured?: boolean }) {
  const supabase = await createClient()

  let query = supabase.from("properties").select("*")

  if (filters?.type) {
    query = query.eq("property_type", filters.type)
  }

  if (filters?.featured) {
    query = query.eq("featured", true)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching properties:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getPropertyById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("properties").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching property:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
