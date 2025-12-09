import { createClient } from "@/lib/supabase/server"
import { CategoriesAdminClient } from "@/components/admin/categories-admin-client"

export default async function CategoriesAdminPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from("categories").select("*").order("display_order", { ascending: true })

  return <CategoriesAdminClient initialCategories={categories || []} />
}
