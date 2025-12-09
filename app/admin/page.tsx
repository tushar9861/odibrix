import { createClient } from "@/lib/supabase/server"
import { AdminDashboardClient } from "@/components/admin/dashboard-client"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch all stats in parallel
  const [leadsResult, propertiesResult, paymentsResult, testimonialsResult, recentLeadsResult] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact" }),
    supabase.from("properties").select("*", { count: "exact" }),
    supabase.from("payments").select("*"),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(10),
  ])

  const allLeads = leadsResult.data || []
  const totalLeads = leadsResult.count || 0
  const totalProperties = propertiesResult.count || 0
  const allPayments = paymentsResult.data || []
  const completedPayments = allPayments.filter((p) => p.payment_status === "completed")
  const totalRevenue = completedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const recentLeads = recentLeadsResult.data || []

  // Calculate leads by status
  const newLeads = allLeads.filter((l) => l.status === "new" || !l.status).length
  const contactedLeads = allLeads.filter((l) => l.status === "contacted").length
  const convertedLeads = allLeads.filter((l) => l.status === "converted").length
  const qualifiedLeads = allLeads.filter((l) => l.status === "qualified").length

  // Calculate leads by type
  const bookVisitLeads = allLeads.filter((l) => l.lead_type === "book_visit").length
  const floorPlanLeads = allLeads.filter((l) => l.lead_type === "floor_plan").length
  const consultLeads = allLeads.filter((l) => l.lead_type === "consult").length

  return (
    <AdminDashboardClient
      stats={{
        totalLeads,
        totalProperties,
        totalRevenue,
        completedPayments: completedPayments.length,
        newLeads,
        contactedLeads,
        convertedLeads,
        qualifiedLeads,
      }}
      leadTypeStats={{
        bookVisitLeads,
        floorPlanLeads,
        consultLeads,
      }}
      recentLeads={recentLeads}
    />
  )
}
