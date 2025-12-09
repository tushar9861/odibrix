import { createClient } from "@/lib/supabase/server"
import { getAgents, getAgentStats, getRegions } from "@/lib/actions/agents"
import { AgentsAdminClient } from "@/components/admin/agents-admin-client"

export const metadata = {
  title: "Agent Management | OdiBrix Admin",
  description: "Manage agents, award Brix points, and track performance",
}

export default async function AgentsAdminPage() {
  const supabase = await createClient()

  const agents = await getAgents()
  const stats = await getAgentStats()
  const regions = await getRegions()

  // Get email templates
  const { data: emailTemplates } = await supabase.from("email_templates").select("*").eq("is_active", true)

  return <AgentsAdminClient agents={agents} stats={stats} regions={regions} emailTemplates={emailTemplates || []} />
}
