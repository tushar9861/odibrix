"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function registerPropertyOwner(formData: {
  fullName: string
  email: string
  phone: string
  kycType: string
  kycDocumentUrl: string
  propertyPapersUrl: string[]
  address: string
  city: string
  region: string
  bio?: string
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { data, error } = await supabase
      .from("property_owners")
      .insert({
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        kyc_type: formData.kycType,
        kyc_document_url: formData.kycDocumentUrl,
        kyc_status: "pending",
        property_papers_url: formData.propertyPapersUrl,
        papers_status: "pending",
        registration_type: "self",
        address: formData.address,
        city: formData.city,
        region: formData.region,
        bio: formData.bio,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Owner registration error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/owner/dashboard")
    return { success: true, owner: data }
  } catch (error) {
    console.error("[v0] Owner registration exception:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to register as owner" }
  }
}

export async function getPropertyOwner(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("property_owners").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("[v0] Owner fetch error:", error)
    return null
  }

  return data
}

export async function getOwnerProperties(ownerId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Owner properties fetch error:", error)
    return []
  }

  return data
}

export async function getOwnerLeads(ownerId: string) {
  const supabase = await createClient()

  const { data: properties } = await supabase.from("properties").select("id").eq("owner_id", ownerId)

  if (!properties || properties.length === 0) {
    return []
  }

  const propertyIds = properties.map((p) => p.id)

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .in("property_id", propertyIds)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Owner leads fetch error:", error)
    return []
  }

  return data
}

export async function updateOwnerProfile(ownerId: string, formData: any) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("property_owners")
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ownerId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/owner/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Owner profile update error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update profile" }
  }
}

export async function registerOwnerViaAgent(formData: {
  fullName: string
  email: string
  phone: string
  kycType: string
  kycDocumentUrl: string
  propertyPapersUrl: string[]
  address: string
  city: string
  region: string
  agentId: string
}) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("property_owners")
      .insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        kyc_type: formData.kycType,
        kyc_document_url: formData.kycDocumentUrl,
        kyc_status: "pending",
        property_papers_url: formData.propertyPapersUrl,
        papers_status: "pending",
        registration_type: "agent_referral",
        referring_agent_id: formData.agentId,
        address: formData.address,
        city: formData.city,
        region: formData.region,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Award referral Brix points to agent
    await supabase.from("agent_brix_history").insert({
      agent_id: formData.agentId,
      points: 20,
      reason: `Property Owner referral - ${formData.fullName}`,
    })

    // Update agent Brix points
    const { data: agent } = await supabase.from("agents").select("brix_points").eq("id", formData.agentId).single()

    if (agent) {
      await supabase
        .from("agents")
        .update({ brix_points: (agent.brix_points || 0) + 20 })
        .eq("id", formData.agentId)
    }

    return { success: true, owner: data }
  } catch (error) {
    console.error("[v0] Owner registration error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to register owner" }
  }
}
