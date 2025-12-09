import { createClient } from "@/lib/supabase/server"
import { PropertiesAdminClient } from "@/components/admin/properties-admin-client"

export default async function PropertiesAdminPage() {
  const supabase = await createClient()

  const [propertiesResult, categoriesResult] = await Promise.all([
    supabase.from("properties").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ])

  return (
    <PropertiesAdminClient initialProperties={propertiesResult.data || []} categories={categoriesResult.data || []} />
  )
}
