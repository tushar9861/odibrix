"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAgents(filters?: {
  region?: string
  status?: string
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from("agents")
    .select(`
      *,
      users!agents_user_id_fkey (
        name,
        email
      )
    `)
    .order("brix_points", { ascending: false })

  if (filters?.region && filters.region !== "all") {
    query = query.eq("region", filters.region)
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.or(`agency_name.ilike.%${filters.search}%,city.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching agents:", error)
    return []
  }

  // Flatten the user data
  return data.map((agent: any) => ({
    ...agent,
    name: agent.users?.name || agent.agency_name,
    email: agent.users?.email,
  }))
}

export async function getAgentById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("agents")
    .select(`
      *,
      users!agents_user_id_fkey (
        name,
        email
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching agent:", error)
    return null
  }

  return {
    ...data,
    name: data.users?.name || data.agency_name,
    email: data.users?.email,
  }
}

export async function getAgentByUserId(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("agents").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching agent:", error)
    return null
  }

  return data
}

export async function updateAgentStatus(id: string, status: string, reason?: string) {
  const supabase = await createClient()

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "approved") {
    updateData.approved_at = new Date().toISOString()
  }

  if (status === "suspended" && reason) {
    updateData.suspension_reason = reason
  }

  const { error } = await supabase.from("agents").update(updateData).eq("id", id)

  if (error) {
    console.error("Error updating agent status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/agents")
  return { success: true }
}

export async function awardBrixPoints(agentId: string, points: number, reason: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Insert into brix history
  const { error: historyError } = await supabase.from("agent_brix_history").insert({
    agent_id: agentId,
    points,
    reason,
    awarded_by: user?.id,
  })

  if (historyError) {
    console.error("Error inserting brix history:", historyError)
    return { success: false, error: historyError.message }
  }

  // Update agent's total points
  const { data: agent } = await supabase.from("agents").select("brix_points").eq("id", agentId).single()

  const newPoints = (agent?.brix_points || 0) + points

  const { error: updateError } = await supabase
    .from("agents")
    .update({ brix_points: newPoints, updated_at: new Date().toISOString() })
    .eq("id", agentId)

  if (updateError) {
    console.error("Error updating agent points:", updateError)
    return { success: false, error: updateError.message }
  }

  revalidatePath("/admin/agents")
  return { success: true, newTotal: newPoints }
}

export async function setBestAgentOfMonth(agentId: string, month: string) {
  const supabase = await createClient()

  // Reset previous best agent
  await supabase.from("agents").update({ is_best_agent: false }).eq("is_best_agent", true)

  // Set new best agent
  const { error } = await supabase
    .from("agents")
    .update({
      is_best_agent: true,
      best_agent_month: month,
      updated_at: new Date().toISOString(),
    })
    .eq("id", agentId)

  if (error) {
    console.error("Error setting best agent:", error)
    return { success: false, error: error.message }
  }

  // Award bonus points
  await awardBrixPoints(agentId, 500, `Best Agent of the Month - ${month}`)

  revalidatePath("/admin/agents")
  return { success: true }
}

export async function getBrixHistory(agentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("agent_brix_history")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching brix history:", error)
    return []
  }

  return data
}

export async function getAgentStats() {
  const supabase = await createClient()

  const { data: agents } = await supabase.from("agents").select("status, region, brix_points, total_sales")

  const stats = {
    total: agents?.length || 0,
    pending: agents?.filter((a) => a.status === "pending").length || 0,
    approved: agents?.filter((a) => a.status === "approved").length || 0,
    suspended: agents?.filter((a) => a.status === "suspended").length || 0,
    totalBrixAwarded: agents?.reduce((sum, a) => sum + (a.brix_points || 0), 0) || 0,
    totalSales: agents?.reduce((sum, a) => sum + Number(a.total_sales || 0), 0) || 0,
    regionBreakdown: {} as Record<string, number>,
  }

  agents?.forEach((agent) => {
    if (agent.region) {
      stats.regionBreakdown[agent.region] = (stats.regionBreakdown[agent.region] || 0) + 1
    }
  })

  return stats
}

export async function getRegions() {
  const supabase = await createClient()

  const { data } = await supabase.from("agents").select("region").not("region", "is", null)

  const regions = [...new Set(data?.map((a) => a.region).filter(Boolean))]
  return regions as string[]
}

export async function registerAgent(formData: {
  userId: string
  agencyName: string
  city: string
  region: string
  phone: string
  alternatePhone?: string
  bio?: string
  specialization?: string[]
}) {
  const supabase = await createClient()

  // Generate referral code
  const referralCode = `ODB${Date.now().toString(36).toUpperCase()}`

  const { data, error } = await supabase
    .from("agents")
    .insert({
      user_id: formData.userId,
      agency_name: formData.agencyName,
      city: formData.city,
      region: formData.region,
      phone: formData.phone,
      alternate_phone: formData.alternatePhone,
      bio: formData.bio,
      specialization: formData.specialization,
      referral_code: referralCode,
      status: "pending",
      brix_points: 50, // Welcome bonus
      total_listings: 0,
      total_leads: 0,
      total_views: 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Error registering agent:", error)
    return { success: false, error: error.message }
  }

  return { success: true, agent: data }
}

export async function updateAgentProfile(agentId: string, formData: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("agents")
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", agentId)

  if (error) {
    console.error("Error updating agent:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/agent/dashboard")
  return { success: true }
}
