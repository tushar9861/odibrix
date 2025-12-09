"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Phone, Mail, Search, Filter } from "lucide-react"
import type { Lead } from "@/lib/types"

interface LeadsTableProps {
  leads: Lead[]
}

const statusColors: Record<Lead["status"], string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search)
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesType = typeFilter === "all" || lead.lead_type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
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
                className="pl-9 w-[200px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        {lead.property_interest && (
                          <p className="text-xs text-muted-foreground capitalize">{lead.property_interest}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <a href={`tel:${lead.phone}`} className="text-sm flex items-center gap-1 hover:text-primary">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary"
                        >
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {lead.lead_type?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 bg-transparent" asChild>
                          <a href={`tel:${lead.phone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 bg-transparent" asChild>
                          <a href={`mailto:${lead.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No leads found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
