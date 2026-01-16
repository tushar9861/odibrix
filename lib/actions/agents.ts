"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

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
  try {
    const supabase = await createClient()

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
        status: "pending",
        brix_points: 50, // Welcome bonus
        commission_rate: 2,
        rating: 0,
        review_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Agent registration error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/agent/dashboard")
    return { success: true, agent: data }
  } catch (error) {
    console.error("[v0] Agent registration exception:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to register agent" }
  }
}

export async function getAgentByUserId(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("agents").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("[v0] Agent fetch error:", error)
    return null
  }

  return data
}

export async function getAgentReferrals(agentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("property_owners")
    .select("*")
    .eq("referring_agent_id", agentId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Referrals fetch error:", error)
    return []
  }

  return data
}

export async function getReferralStats(agentId: string) {
  const supabase = await createClient()

  // Get referred owners
  const { data: owners } = await supabase.from("property_owners").select("id").eq("referring_agent_id", agentId)

  // Get Brix history for this agent
  const { data: brixHistory } = await supabase
    .from("agent_brix_history")
    .select("*")
    .eq("agent_id", agentId)
    .contains("reason", "referral")

  return {
    totalReferrals: owners?.length || 0,
    brixEarned: brixHistory?.reduce((sum, h) => sum + h.points, 0) || 0,
  }
}

export async function generateReferralLink(agentId: string) {
  const supabase = await createClient()

  // Get agent's referral code
  const { data } = await supabase.from("agents").select("referral_code").eq("id", agentId).single()

  if (!data?.referral_code) {
    return null
  }

  // Generate link with agent referral code
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "https://odibrix.com"
  return `${baseUrl}/auth/sign-up?ref=${data.referral_code}`
}

export async function getBrixHistory(agentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("agent_brix_history")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Brix history fetch error:", error)
    return []
  }

  return data
}

export async function getAgents() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("agents").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Get agents error:", error)
    return []
  }

  return data || []
}

export async function getAgentStats() {
  const supabase = await createClient()

  // Get total agents
  const { count: totalAgents } = await supabase.from("agents").select("*", { count: "exact", head: true })

  // Get pending approvals
  const { count: pendingApprovals } = await supabase
    .from("agents")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  // Get active agents
  const { count: activeAgents } = await supabase
    .from("agents")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // Get total Brix awarded
  const { data: brixData } = await supabase.from("agent_brix_history").select("points")

  const totalBrixAwarded = brixData?.reduce((sum, h) => sum + h.points, 0) || 0

  return {
    totalAgents: totalAgents || 0,
    pendingApprovals: pendingApprovals || 0,
    activeAgents: activeAgents || 0,
    totalBrixAwarded,
  }
}

export async function getRegions() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("agents").select("region").not("region", "is", null)

  if (error) {
    console.error("[v0] Get regions error:", error)
    return []
  }

  // Get unique regions
  const regions = [...new Set(data?.map((d) => d.region).filter(Boolean))] as string[]
  return regions.sort()
}

export async function updateAgentStatus(agentId: string, status: "active" | "pending" | "suspended" | "rejected") {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("agents")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", agentId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Update agent status error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/agents")
    return { success: true, agent: data }
  } catch (error) {
    console.error("[v0] Update agent status exception:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update agent status" }
  }
}

export async function awardBrixPoints(agentId: string, points: number, reason: string) {
  try {
    const supabase = await createClient()

    // Update agent Brix points
    const { data: agent } = await supabase.from("agents").select("brix_points").eq("id", agentId).single()

    const newBrixPoints = (agent?.brix_points || 0) + points

    const { error: updateError } = await supabase
      .from("agents")
      .update({ brix_points: newBrixPoints, updated_at: new Date().toISOString() })
      .eq("id", agentId)

    if (updateError) throw updateError

    // Create history record
    const { error: historyError } = await supabase.from("agent_brix_history").insert({
      agent_id: agentId,
      points,
      reason,
      created_at: new Date().toISOString(),
    })

    if (historyError) throw historyError

    revalidatePath("/admin/agents")
    revalidatePath("/admin/brix")

    return { success: true, newBrixPoints }
  } catch (error) {
    console.error("[v0] Award Brix points error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to award Brix points" }
  }
}

export async function setBestAgentOfMonth(agentId: string) {
  try {
    const supabase = await createClient()

    // Clear previous best agent
    const { error: clearError } = await supabase
      .from("agents")
      .update({ is_best_agent_of_month: false, updated_at: new Date().toISOString() })
      .eq("is_best_agent_of_month", true)

    if (clearError) console.error("[v0] Clear best agent error:", clearError)

    // Set new best agent
    const { error: setError } = await supabase
      .from("agents")
      .update({ is_best_agent_of_month: true, updated_at: new Date().toISOString() })
      .eq("id", agentId)

    if (setError) throw setError

    // Award bonus Brix points
    await awardBrixPoints(agentId, 500, "Best Agent of Month Award")

    revalidatePath("/admin/agents")
    revalidatePath("/agents")

    return { success: true }
  } catch (error) {
    console.error("[v0] Set best agent error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to set best agent" }
  }
}
