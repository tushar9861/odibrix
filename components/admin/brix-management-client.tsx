"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, Gift, Search, TrendingUp, Users, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { awardBrixPoints } from "@/lib/actions/agents"
import { calculateBrixDiscount, getBrixTier, BRIX_EARNING_RULES, formatINR } from "@/lib/brix-utils"

interface BrixManagementProps {
  agents: any[]
  transactions: any[]
  stats: {
    totalBrixAwarded: number
    agentsWithBrix: number
    totalAgents: number
  }
}

export function BrixManagementClient({ agents, transactions, stats }: BrixManagementProps) {
  const router = useRouter()
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [showAwardDialog, setShowAwardDialog] = useState(false)
  const [brixPoints, setBrixPoints] = useState("")
  const [brixReason, setBrixReason] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredAgents = agents.filter(
    (agent) =>
      !searchQuery ||
      agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.agency_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAwardBrix = async () => {
    if (!selectedAgent || !brixPoints || !brixReason) return

    setIsSubmitting(true)
    const result = await awardBrixPoints(selectedAgent.id, Number.parseInt(brixPoints), brixReason)
    if (result.success) {
      setShowAwardDialog(false)
      setBrixPoints("")
      setBrixReason("")
      setSelectedAgent(null)
      router.refresh()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Brix Awarded</p>
                <p className="text-3xl font-bold text-amber-500">{stats.totalBrixAwarded.toLocaleString()}</p>
              </div>
              <Award className="h-8 w-8 text-amber-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agents with Brix</p>
                <p className="text-3xl font-bold text-green-500">{stats.agentsWithBrix}</p>
              </div>
              <Users className="h-8 w-8 text-green-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Points/Agent</p>
                <p className="text-3xl font-bold text-blue-500">
                  {stats.totalAgents > 0 ? Math.round(stats.totalBrixAwarded / stats.totalAgents) : 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Discount</p>
                <p className="text-3xl font-bold text-purple-500">30%</p>
                <p className="text-xs text-muted-foreground">at 1000+ points</p>
              </div>
              <Gift className="h-8 w-8 text-purple-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Brix Earning Rules</CardTitle>
              <CardDescription>How agents can earn Brix points</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(BRIX_EARNING_RULES).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg bg-muted/50 text-center">
                <div className="text-2xl font-bold text-amber-500">+{value}</div>
                <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ").toLowerCase()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agent Leaderboard</CardTitle>
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredAgents.map((agent, index) => {
                const tier = getBrixTier(agent.brix_points || 0)
                const discount = calculateBrixDiscount(agent.brix_points || 0)

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-bold text-lg text-muted-foreground w-6">#{index + 1}</div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={agent.profile_image || "/placeholder.svg"} />
                      <AvatarFallback>{agent.name?.charAt(0) || "A"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{agent.name || agent.agency_name}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs text-white ${tier.color}`}>{tier.name}</Badge>
                        <span className="text-xs text-muted-foreground">{discount}% discount</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-500">{agent.brix_points || 0}</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          setSelectedAgent(agent)
                          setShowAwardDialog(true)
                        }}
                      >
                        <Gift className="h-3 w-3 mr-1" />
                        Award
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest Brix point awards and deductions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              ) : (
                transactions.map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div
                      className={`p-2 rounded-full ${tx.points > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                    >
                      {tx.points > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{tx.agent_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{tx.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${tx.points > 0 ? "text-green-600" : "text-red-600"}`}>
                        {tx.points > 0 ? "+" : ""}
                        {tx.points}
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discount Tiers</CardTitle>
          <CardDescription>How Brix points translate to discounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Points Required</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Example Savings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-orange-400 to-orange-600 text-white">Bronze</Badge>
                </TableCell>
                <TableCell>0 - 199</TableCell>
                <TableCell>0% - 5%</TableCell>
                <TableCell>
                  Save up to {formatINR(250)} on {formatINR(4999)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white">Silver</Badge>
                </TableCell>
                <TableCell>200 - 499</TableCell>
                <TableCell>6% - 14%</TableCell>
                <TableCell>
                  Save up to {formatINR(700)} on {formatINR(4999)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">Gold</Badge>
                </TableCell>
                <TableCell>500 - 999</TableCell>
                <TableCell>15% - 29%</TableCell>
                <TableCell>
                  Save up to {formatINR(1450)} on {formatINR(4999)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-slate-400 to-slate-600 text-white">Platinum</Badge>
                </TableCell>
                <TableCell>1000+</TableCell>
                <TableCell>30% (MAX)</TableCell>
                <TableCell>
                  Save {formatINR(1500)} on {formatINR(4999)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAwardDialog} onOpenChange={setShowAwardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Award Brix Points</DialogTitle>
            <DialogDescription>
              Reward {selectedAgent?.name || selectedAgent?.agency_name} with Brix points
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedAgent?.profile_image || "/placeholder.svg"} />
                <AvatarFallback>{selectedAgent?.name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedAgent?.name || selectedAgent?.agency_name}</p>
                <p className="text-sm text-muted-foreground">Current: {selectedAgent?.brix_points || 0} points</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(BRIX_EARNING_RULES).map(([key, value]) => (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBrixPoints(value.toString())
                    setBrixReason(key.replace(/_/g, " "))
                  }}
                  className="text-xs bg-transparent"
                >
                  +{value}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Points to Award</Label>
              <Input
                type="number"
                value={brixPoints}
                onChange={(e) => setBrixPoints(e.target.value)}
                placeholder="Enter points (use negative for deduction)"
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={brixReason}
                onChange={(e) => setBrixReason(e.target.value)}
                placeholder="Reason for awarding/deducting points..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAwardDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAwardBrix} disabled={isSubmitting || !brixPoints || !brixReason}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Gift className="h-4 w-4 mr-2" />}
              Award Points
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
