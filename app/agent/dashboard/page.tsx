import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAgentByUserId } from "@/lib/actions/agents"
import { AgentDashboardClient } from "@/components/agent/dashboard-client"

export const metadata = {
  title: "Agent Dashboard | OdiBrix",
  description: "Manage your property listings and connect with customers",
}

export default async function AgentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has an agent profile
  const agent = await getAgentByUserId(user.id)

  // Get agent's properties
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("agent_id", agent?.id || user.id)
    .order("created_at", { ascending: false })

  // Get agent's leads
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("agent_id", agent?.id || user.id)
    .order("created_at", { ascending: false })

  // Get categories for property form
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order")

  return (
    <AgentDashboardClient
      user={user}
      agent={agent}
      properties={properties || []}
      leads={leads || []}
      categories={categories || []}
    />
  )
}
