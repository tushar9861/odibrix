import { createClient } from "@/lib/supabase/server"
import { BrixManagementClient } from "@/components/admin/brix-management-client"

export default async function BrixManagementPage() {
  const supabase = await createClient()

  // Get all agents with their brix points
  const { data: agents } = await supabase
    .from("agents")
    .select(`
      id,
      agency_name,
      brix_points,
      profile_image,
      city,
      region,
      users!agents_user_id_fkey (
        name,
        email
      )
    `)
    .order("brix_points", { ascending: false })

  // Get brix transactions history
  const { data: transactions } = await supabase
    .from("agent_brix_history")
    .select(`
      *,
      agents (
        agency_name,
        users!agents_user_id_fkey (name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  // Calculate stats
  const totalBrixAwarded = agents?.reduce((sum, a) => sum + (a.brix_points || 0), 0) || 0
  const agentsWithBrix = agents?.filter((a) => (a.brix_points || 0) > 0).length || 0

  const formattedAgents =
    agents?.map((agent: any) => ({
      ...agent,
      name: agent.users?.name || agent.agency_name,
      email: agent.users?.email,
    })) || []

  const formattedTransactions =
    transactions?.map((t: any) => ({
      ...t,
      agent_name: t.agents?.users?.name || t.agents?.agency_name || "Unknown",
    })) || []

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">Brix Points Management</h1>
        <p className="text-muted-foreground">Manage agent rewards and track Brix point transactions</p>
      </div>

      <BrixManagementClient
        agents={formattedAgents}
        transactions={formattedTransactions}
        stats={{
          totalBrixAwarded,
          agentsWithBrix,
          totalAgents: agents?.length || 0,
        }}
      />
    </div>
  )
}
