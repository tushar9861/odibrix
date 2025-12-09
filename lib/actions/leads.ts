"use server"

import { createClient } from "@/lib/supabase/server"
import type { Lead } from "@/lib/types"

export async function createLead(data: Omit<Lead, "id" | "created_at" | "status" | "notes">) {
  const supabase = await createClient()

  const { data: lead, error } = await supabase.from("leads").insert(data).select().single()

  if (error) {
    console.error("Error creating lead:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data: lead }
}

export async function getLeads() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateLeadStatus(id: string, status: Lead["status"], notes?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("leads").update({ status, notes }).eq("id", id).select().single()

  if (error) {
    console.error("Error updating lead:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
