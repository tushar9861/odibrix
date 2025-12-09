"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Award,
  Trophy,
  Mail,
  Phone,
  MapPin,
  Star,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Loader2,
  Gift,
  Send,
  Crown,
  IndianRupee,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateAgentStatus, awardBrixPoints, setBestAgentOfMonth } from "@/lib/actions/agents"
import type { Agent, EmailTemplate } from "@/lib/types"

interface AgentsAdminProps {
  agents: Agent[]
  stats: {
    total: number
    pending: number
    approved: number
    suspended: number
    totalBrixAwarded: number
    totalSales: number
    regionBreakdown: Record<string, number>
  }
  regions: string[]
  emailTemplates: EmailTemplate[]
}

export function AgentsAdminClient({ agents: initialAgents, stats, regions, emailTemplates }: AgentsAdminProps) {
  const router = useRouter()
  const [agents, setAgents] = useState(initialAgents)
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showBrixDialog, setShowBrixDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showBestAgentDialog, setShowBestAgentDialog] = useState(false)
  const [brixPoints, setBrixPoints] = useState("")
  const [brixReason, setBrixReason] = useState("")
  const [emailTemplate, setEmailTemplate] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter agents
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      !searchQuery ||
      agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.agency_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.city?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion = regionFilter === "all" || agent.region === regionFilter
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter

    return matchesSearch && matchesRegion && matchesStatus
  })

  // Get best agent
  const bestAgent = agents.find((a) => a.is_best_agent)

  const handleStatusChange = async (agentId: string, newStatus: string) => {
    setIsSubmitting(true)
    const result = await updateAgentStatus(agentId, newStatus)
    if (result.success) {
      router.refresh()
    }
    setIsSubmitting(false)
  }

  const handleAwardBrix = async () => {
    if (!selectedAgent || !brixPoints || !brixReason) return

    setIsSubmitting(true)
    const result = await awardBrixPoints(selectedAgent.id, Number.parseInt(brixPoints), brixReason)
    if (result.success) {
      setShowBrixDialog(false)
      setBrixPoints("")
      setBrixReason("")
      router.refresh()
    }
    setIsSubmitting(false)
  }

  const handleSetBestAgent = async () => {
    if (!selectedAgent) return

    setIsSubmitting(true)
    const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })
    const result = await setBestAgentOfMonth(selectedAgent.id, currentMonth)
    if (result.success) {
      setShowBestAgentDialog(false)
      router.refresh()
    }
    setIsSubmitting(false)
  }

  const handleSendEmail = async () => {
    // Email sending would be implemented here
    alert("Email functionality requires SMTP configuration in Settings")
    setShowEmailDialog(false)
  }

  const handleSelectTemplate = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId)
    if (template) {
      setEmailSubject(template.subject)
      setEmailBody(template.body)
    }
    setEmailTemplate(templateId)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Agent Management</h1>
          <p className="text-muted-foreground">Manage agents, award Brix points, and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-3xl font-bold text-amber-500">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <p className="text-3xl font-bold text-green-500">{stats.approved}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Brix Awarded</p>
                  <p className="text-3xl font-bold text-purple-500">{stats.totalBrixAwarded.toLocaleString()}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-3xl font-bold text-accent">₹{(stats.totalSales / 10000000).toFixed(1)}Cr</p>
                </div>
                <IndianRupee className="h-8 w-8 text-accent/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best Agent Banner */}
        {bestAgent && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-amber-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-amber-500">
                      <AvatarImage src={bestAgent.profile_image || ""} />
                      <AvatarFallback className="text-2xl bg-amber-500 text-white">
                        {bestAgent.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <Crown className="absolute -top-2 -right-2 h-8 w-8 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <span className="text-amber-600 font-semibold">Best Agent of the Month</span>
                    </div>
                    <h3 className="text-2xl font-bold">{bestAgent.name || bestAgent.agency_name}</h3>
                    <p className="text-muted-foreground">
                      {bestAgent.city}, {bestAgent.region}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-amber-500">{bestAgent.brix_points}</div>
                    <p className="text-sm text-muted-foreground">Brix Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents by name, agency, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Agents List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAgents.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No agents found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              </Card>
            ) : (
              filteredAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`overflow-hidden ${agent.is_best_agent ? "ring-2 ring-amber-500" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Avatar & Basic Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={agent.profile_image || ""} />
                              <AvatarFallback className="text-xl">
                                {agent.name?.charAt(0) || agent.agency_name?.charAt(0) || "A"}
                              </AvatarFallback>
                            </Avatar>
                            {agent.is_best_agent && (
                              <Crown className="absolute -top-1 -right-1 h-5 w-5 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{agent.name || agent.agency_name}</h3>
                              <Badge
                                variant={
                                  agent.status === "approved"
                                    ? "default"
                                    : agent.status === "suspended"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {agent.status}
                              </Badge>
                              {agent.is_best_agent && <Badge className="bg-amber-500">Best Agent</Badge>}
                            </div>
                            {agent.agency_name && agent.name && (
                              <p className="text-sm text-muted-foreground">{agent.agency_name}</p>
                            )}
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {agent.city}, {agent.region}
                              </span>
                              {agent.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {agent.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{agent.total_listings}</div>
                            <p className="text-xs text-muted-foreground">Listings</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{agent.total_leads}</div>
                            <p className="text-xs text-muted-foreground">Leads</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{agent.total_views}</div>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-500">{agent.brix_points}</div>
                            <p className="text-xs text-muted-foreground">Brix</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-xl font-bold">{agent.rating?.toFixed(1) || "0.0"}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{agent.review_count || 0} reviews</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAgent(agent)
                                setShowBrixDialog(true)
                              }}
                            >
                              <Gift className="h-4 w-4 mr-2" />
                              Award Brix Points
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAgent(agent)
                                setShowEmailDialog(true)
                              }}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAgent(agent)
                                setShowBestAgentDialog(true)
                              }}
                            >
                              <Trophy className="h-4 w-4 mr-2" />
                              Set as Best Agent
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {agent.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(agent.id, "approved")}
                                className="text-green-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve Agent
                              </DropdownMenuItem>
                            )}
                            {agent.status === "approved" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(agent.id, "suspended")}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Suspend Agent
                              </DropdownMenuItem>
                            )}
                            {agent.status === "suspended" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(agent.id, "approved")}
                                className="text-green-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Reactivate Agent
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Award Brix Dialog */}
        <Dialog open={showBrixDialog} onOpenChange={setShowBrixDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-500" />
                Award Brix Points
              </DialogTitle>
              <DialogDescription>
                Reward {selectedAgent?.name || selectedAgent?.agency_name} with Brix points for their performance.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="points">Points to Award</Label>
                <Input
                  id="points"
                  type="number"
                  value={brixPoints}
                  onChange={(e) => setBrixPoints(e.target.value)}
                  placeholder="e.g., 100"
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={brixReason}
                  onChange={(e) => setBrixReason(e.target.value)}
                  placeholder="e.g., Excellent performance in December"
                />
              </div>
              <div className="flex gap-2">
                {[50, 100, 200, 500].map((points) => (
                  <Button key={points} variant="outline" size="sm" onClick={() => setBrixPoints(points.toString())}>
                    +{points}
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBrixDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAwardBrix} disabled={isSubmitting || !brixPoints || !brixReason}>
                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Gift className="h-4 w-4 mr-2" />}
                Award Points
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Email Dialog */}
        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Send Email to {selectedAgent?.name || selectedAgent?.agency_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Email Template</Label>
                <Select value={emailTemplate} onValueChange={handleSelectTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template or write custom" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>
              <div>
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Email body..."
                  rows={8}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} disabled={!emailSubject || !emailBody}>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Best Agent Dialog */}
        <Dialog open={showBestAgentDialog} onOpenChange={setShowBestAgentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Set Best Agent of the Month
              </DialogTitle>
              <DialogDescription>
                Award {selectedAgent?.name || selectedAgent?.agency_name} as the Best Agent of the Month? They will
                receive a badge and 500 bonus Brix points.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                <CardContent className="p-4 text-center">
                  <Crown className="h-12 w-12 mx-auto mb-2 text-amber-500" />
                  <h3 className="font-bold text-lg">{selectedAgent?.name || selectedAgent?.agency_name}</h3>
                  <p className="text-muted-foreground">
                    {selectedAgent?.city}, {selectedAgent?.region}
                  </p>
                  <div className="mt-4 flex justify-center gap-4">
                    <div>
                      <div className="font-bold">{selectedAgent?.total_listings}</div>
                      <p className="text-xs text-muted-foreground">Listings</p>
                    </div>
                    <div>
                      <div className="font-bold">{selectedAgent?.brix_points}</div>
                      <p className="text-xs text-muted-foreground">Brix</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBestAgentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetBestAgent} disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600">
                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trophy className="h-4 w-4 mr-2" />}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Add Clock icon that was missing
function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
