import { Suspense } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { VerifiedAgentsClient } from "@/components/agents/verified-agents-client"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "OdiBrix Verified Agents - Professional Real Estate Experts",
  description:
    "Connect with OdiBrix verified agents in Odisha. Find trusted real estate professionals for buying, selling, and leasing properties.",
  openGraph: {
    title: "OdiBrix Verified Agents | Premium Real Estate Professionals",
    description: "Find trusted real estate agents in Odisha with OdiBrix verification.",
  },
}

async function getVerifiedAgents() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("status", "approved")
    .gt("rating", 0)
    .order("rating", { ascending: false })
    .limit(12)

  if (error) {
    console.error("[v0] Agents fetch error:", error)
    return []
  }

  return data || []
}

export default async function VerifiedAgentsPage() {
  const agents = await getVerifiedAgents()

  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<div className="pt-32 pb-20 text-center">Loading agents...</div>}>
        <VerifiedAgentsClient agents={agents} />
      </Suspense>
      <Footer />
    </div>
  )
}
