"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Phone, Search, Filter, Calendar, Users, TrendingUp, PhoneCall } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Lead } from "@/lib/types"

interface LeadsTableProps {
  leads: Lead[]
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
  lost: "bg-red-100 text-red-800",
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  const filterByDate = (leadsToFilter: Lead[]) => {
    const now = new Date()

    if (dateFilter === "daily") {
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      return leadsToFilter.filter((l) => new Date(l.created_at) >= dayAgo)
    } else if (dateFilter === "weekly") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return leadsToFilter.filter((l) => new Date(l.created_at) >= weekAgo)
    } else if (dateFilter === "monthly") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return leadsToFilter.filter((l) => new Date(l.created_at) >= monthAgo)
    }

    return leadsToFilter
  }

  const filteredLeads = filterByDate(leads).filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search)
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesType = typeFilter === "all" || lead.lead_type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: leads.length,
    today: leads.filter((l) => {
      const today = new Date()
      const leadDate = new Date(l.created_at)
      return leadDate.toDateString() === today.toDateString()
    }).length,
    thisWeek: leads.filter((l) => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return new Date(l.created_at) >= weekAgo
    }).length,
    converted: leads.filter((l) => l.status === "converted").length,
  }

  const handleCall = async (lead: Lead) => {
    try {
      const supabase = createClient()
      await supabase
        .from("leads")
        .update({
          call_count: ((lead as any).call_count || 0) + 1,
          last_called_at: new Date().toISOString(),
          contact_number_shown: true,
        })
        .eq("id", lead.id)

      // Open phone dialer
      window.location.href = `tel:${lead.phone}`
      router.refresh()
    } catch (error) {
      console.error("Error tracking call:", error)
      window.location.href = `tel:${lead.phone}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-purple-600">{stats.thisWeek}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Converted</p>
                <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
              </div>
              <PhoneCall className="h-8 w-8 text-green-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-[180px]"
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[130px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="daily">Last 24 Hours</SelectItem>
                  <SelectItem value="weekly">Last 7 Days</SelectItem>
                  <SelectItem value="monthly">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="book_visit">Book Visit</SelectItem>
                  <SelectItem value="floor_plan">Floor Plan</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Call</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="group">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{lead.name}</p>
                          {lead.property_interest && (
                            <p className="text-xs text-muted-foreground capitalize">{lead.property_interest}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm">{lead.phone}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">{lead.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-xs">
                          {lead.lead_type?.replace("_", " ") || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${statusColors[lead.status] || statusColors.new}`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                          onClick={() => handleCall(lead)}
                          title={`Call ${lead.name}`}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No leads found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
