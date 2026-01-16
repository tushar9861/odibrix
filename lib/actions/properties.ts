"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

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

export async function createProperty(formData: {
  title: string
  description: string
  property_type: string
  price: string
  area_sqft: string
  bedrooms: string
  bathrooms: string
  location: string
  address: string
  category_id: string
  lat: string
  lng: string
  amenities: string[]
  images: string[]
  documents: string[]
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Get agent ID for the user
    const { data: agent } = await supabase.from("agents").select("id").eq("user_id", user.id).single()

    if (!agent) {
      return { success: false, error: "Agent profile not found" }
    }

    // Validate lat/lng
    const lat = Number.parseFloat(formData.lat)
    const lng = Number.parseFloat(formData.lng)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return { success: false, error: "Invalid latitude or longitude coordinates" }
    }

    const { data, error } = await supabase
      .from("properties")
      .insert({
        title: formData.title,
        description: formData.description,
        property_type: formData.property_type,
        price: formData.price ? Number.parseFloat(formData.price) : null,
        area_sqft: formData.area_sqft ? Number.parseInt(formData.area_sqft) : null,
        bedrooms: formData.bedrooms ? Number.parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number.parseInt(formData.bathrooms) : null,
        location: formData.location,
        address: formData.address,
        category_id: formData.category_id || null,
        latitude: lat,
        longitude: lng,
        images: formData.images,
        images_count: formData.images.length,
        document_urls: formData.documents,
        amenities: formData.amenities,
        agent_id: agent.id,
        status: "available",
        approval_status: "pending",
        featured: false,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Property creation error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/agent/dashboard")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Property creation exception:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create property" }
  }
}

export async function updatePropertyStatus(propertyId: string, status: string, approvalStatus?: string) {
  try {
    const supabase = await createClient()

    const updateData: any = { status }
    if (approvalStatus) {
      updateData.approval_status = approvalStatus
    }

    const { error } = await supabase.from("properties").update(updateData).eq("id", propertyId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/agent/dashboard")
    revalidatePath("/admin/properties")
    return { success: true }
  } catch (error) {
    console.error("[v0] Property update error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update property" }
  }
}
