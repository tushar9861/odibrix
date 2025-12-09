import { createClient } from "@/lib/supabase/server"
import { LeadsTable } from "@/components/admin/leads-table"

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">Leads</h1>
        <p className="text-muted-foreground">Manage and track all customer enquiries</p>
      </div>

      <LeadsTable leads={leads || []} />
    </div>
  )
}
