"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAdminStats() {
  const supabase = await createClient()

  const [agents, owners, properties, leads] = await Promise.all([
    supabase.from("agents").select("id", { count: "exact" }),
    supabase.from("property_owners").select("id", { count: "exact" }),
    supabase.from("properties").select("id", { count: "exact" }),
    supabase.from("leads").select("id", { count: "exact" }),
  ])

  return {
    totalAgents: agents.count || 0,
    totalOwners: owners.count || 0,
    totalProperties: properties.count || 0,
    totalLeads: leads.count || 0,
  }
}

export async function getPendingApprovals() {
  const supabase = await createClient()

  const [agents, owners, properties] = await Promise.all([
    supabase.from("agents").select("*").eq("status", "pending").order("created_at", { ascending: true }),
    supabase.from("property_owners").select("*").eq("kyc_status", "pending").order("created_at", { ascending: true }),
    supabase.from("properties").select("*").eq("approval_status", "pending").order("created_at", { ascending: true }),
  ])

  return {
    pendingAgents: agents.data || [],
    pendingOwners: owners.data || [],
    pendingProperties: properties.data || [],
  }
}

export async function approveAgent(agentId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("agents").update({ status: "approved" }).eq("id", agentId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function rejectAgent(agentId: string, reason: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("agents")
    .update({ status: "rejected", suspension_reason: reason })
    .eq("id", agentId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function approveProperty(propertyId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("properties")
    .update({ approval_status: "approved", featured: true })
    .eq("id", propertyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function rejectProperty(propertyId: string, reason: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("properties")
    .update({ approval_status: "rejected", rejection_reason: reason })
    .eq("id", propertyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function verifyOwner(ownerId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("property_owners")
    .update({ kyc_status: "verified", papers_status: "verified" })
    .eq("id", ownerId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/dashboard")
  return { success: true }
}
