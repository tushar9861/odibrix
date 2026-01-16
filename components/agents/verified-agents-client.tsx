"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, Award, Search, Briefcase } from "lucide-react"
import Link from "next/link"
import type { Agent } from "@/lib/types"

interface VerifiedAgentsClientProps {
  agents: Agent[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export function VerifiedAgentsClient({ agents }: VerifiedAgentsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const regions = Array.from(new Set(agents.map((a) => a.region).filter(Boolean))) as string[]

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.agency_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.city?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = regionFilter === "all" || agent.region === regionFilter
    let matchesRating = true
    if (ratingFilter === "4plus") matchesRating = (agent.rating || 0) >= 4
    else if (ratingFilter === "3plus") matchesRating = (agent.rating || 0) >= 3

    return matchesSearch && matchesRegion && matchesRating
  })

  return (
    <main className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-12">
          <motion.span
            className="text-accent font-semibold text-sm uppercase tracking-wider mb-3 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Expert Network
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">OdiBrix Verified Agents</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with our verified real estate professionals. All agents are verified and rated by customers.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-accent mb-2">{agents.length}+</div>
              <p className="text-muted-foreground">Verified Agents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {agents.reduce((sum, a) => sum + (a.total_listings || 0), 0)}+
              </div>
              <p className="text-muted-foreground">Active Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {agents.reduce((sum, a) => sum + (a.review_count || 0), 0)}+
              </div>
              <p className="text-muted-foreground">Customer Reviews</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-card border rounded-2xl p-6 mb-8 shadow-premium"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by agency name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-2"
              />
            </div>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl border-2">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl border-2">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4plus">4+ Stars</SelectItem>
                <SelectItem value="3plus">3+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Agents Grid */}
        {filteredAgents.length === 0 ? (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center py-20">
            <p className="text-lg text-muted-foreground">No agents found matching your criteria.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAgents.map((agent) => (
              <motion.div key={agent.id} variants={fadeInUp}>
                <Card className="h-full hover:shadow-premium-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg line-clamp-2">{agent.agency_name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {agent.city}, {agent.region}
                        </p>
                      </div>
                      {agent.is_best_agent && (
                        <Badge className="bg-amber-500 flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Best
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(agent.rating || 0)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{(agent.rating || 0).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({agent.review_count || 0} reviews)</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Listings</p>
                        <p className="font-semibold">{agent.total_listings || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Sales</p>
                        <p className="font-semibold">₹{((agent.total_sales || 0) / 10000000).toFixed(1)}Cr</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {agent.bio && <p className="text-sm text-muted-foreground line-clamp-2">{agent.bio}</p>}

                    {/* Contact */}
                    <div className="flex flex-col gap-2 pt-2 border-t">
                      <a href={`tel:${agent.phone}`}>
                        <Button variant="outline" className="w-full gap-2 bg-transparent">
                          <Phone className="h-4 w-4" />
                          {agent.phone}
                        </Button>
                      </a>
                      <Link href={`/agents/${agent.id}`}>
                        <Button className="w-full gap-2 bg-accent hover:bg-accent/90">
                          <Briefcase className="h-4 w-4" />
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
}
