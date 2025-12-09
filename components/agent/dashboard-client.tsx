"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MultiImageUpload } from "@/components/ui/multi-image-upload"
import {
  Building2,
  Users,
  Eye,
  Plus,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Award,
  LogOut,
  Menu,
  X,
  Home,
  Settings,
  ChevronRight,
  IndianRupee,
  Loader2,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { Agent, Property, Lead } from "@/lib/types"

interface AgentDashboardProps {
  user: User
  agent: Agent | null
  properties: Property[]
  leads: Lead[]
  categories: any[]
}

export function AgentDashboardClient({ user, agent, properties, leads, categories }: AgentDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [propertyImages, setPropertyImages] = useState<string[]>([])

  // Property form state
  const [propertyForm, setPropertyForm] = useState({
    title: "",
    description: "",
    property_type: "apartment",
    price: "",
    area_sqft: "",
    bedrooms: "",
    bathrooms: "",
    location: "",
    address: "",
    category_id: "",
    amenities: [] as string[],
  })

  const agentName = agent?.agency_name || user.user_metadata?.name || user.email?.split("@")[0] || "Agent"

  // Calculate stats
  const stats = {
    totalListings: properties.length,
    approvedListings: properties.filter((p) => p.approval_status === "approved").length,
    pendingListings: properties.filter((p) => p.approval_status === "pending").length,
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    totalViews: properties.reduce((sum, p) => sum + (p.view_count || 0), 0),
    brixPoints: agent?.brix_points || 0,
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("properties").insert({
        ...propertyForm,
        price: propertyForm.price ? Number.parseFloat(propertyForm.price) : null,
        area_sqft: propertyForm.area_sqft ? Number.parseInt(propertyForm.area_sqft) : null,
        bedrooms: propertyForm.bedrooms ? Number.parseInt(propertyForm.bedrooms) : null,
        bathrooms: propertyForm.bathrooms ? Number.parseInt(propertyForm.bathrooms) : null,
        images: propertyImages,
        agent_id: agent?.id || user.id,
        status: "available",
        approval_status: "pending",
        featured: false,
      })

      if (error) throw error

      setShowAddProperty(false)
      setPropertyForm({
        title: "",
        description: "",
        property_type: "apartment",
        price: "",
        area_sqft: "",
        bedrooms: "",
        bathrooms: "",
        location: "",
        address: "",
        category_id: "",
        amenities: [],
      })
      setPropertyImages([])
      router.refresh()
    } catch (error) {
      console.error("Error adding property:", error)
      alert("Failed to add property. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    try {
      const supabase = createClient()
      await supabase.from("leads").update({ status }).eq("id", leadId)
      router.refresh()
    } catch (error) {
      console.error("Error updating lead:", error)
    }
  }

  const amenitiesList = [
    "Parking",
    "Swimming Pool",
    "Gym",
    "Garden",
    "Security",
    "Power Backup",
    "Lift",
    "Club House",
    "Children Play Area",
    "Intercom",
    "Fire Safety",
    "CCTV",
  ]

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "properties", label: "My Properties", icon: Building2 },
    { id: "leads", label: "My Leads", icon: Users },
    { id: "earnings", label: "Earnings", icon: IndianRupee },
    { id: "profile", label: "Profile", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/odibrix-logo.jpg" alt="OdiBrix" width={48} height={48} className="rounded-full" />
              <div>
                <h1 className="font-serif font-bold text-lg">Agent Portal</h1>
                <p className="text-xs text-muted-foreground">OdiBrix Real Estate</p>
              </div>
            </Link>
          </div>

          {/* Brix Points Card */}
          <div className="p-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">Brix Points</span>
              </div>
              <div className="text-3xl font-bold">{stats.brixPoints}</div>
              {agent?.is_best_agent && <Badge className="mt-2 bg-white/20 text-white">Best Agent</Badge>}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {activeTab === item.id && <ChevronRight className="h-4 w-4 ml-auto" />}
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {agent?.profile_image ? (
                  <img
                    src={agent.profile_image || "/placeholder.svg"}
                    alt={agentName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-primary">{agentName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{agentName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-0 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold mb-2">Welcome back, {agentName}!</h2>
                <p className="text-muted-foreground">Here's an overview of your performance and listings.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">My Listings</CardTitle>
                    <Building2 className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalListings}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.approvedListings} approved, {stats.pendingListings} pending
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">My Leads</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalLeads}</div>
                    <p className="text-xs text-muted-foreground">{stats.newLeads} new inquiries</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Property Views</CardTitle>
                    <Eye className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalViews}</div>
                    <p className="text-xs text-muted-foreground">Total impressions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Brix Points</CardTitle>
                    <Award className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.brixPoints}</div>
                    <p className="text-xs text-muted-foreground">Reward points</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your listings and leads</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start gap-2 bg-transparent"
                      variant="outline"
                      onClick={() => setShowAddProperty(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add New Property Listing
                    </Button>
                    <Button
                      className="w-full justify-start gap-2 bg-transparent"
                      variant="outline"
                      onClick={() => setActiveTab("leads")}
                    >
                      <MessageSquare className="h-4 w-4" />
                      View Customer Inquiries ({stats.newLeads} new)
                    </Button>
                    <Button
                      className="w-full justify-start gap-2 bg-transparent"
                      variant="outline"
                      onClick={() => setActiveTab("properties")}
                    >
                      <Eye className="h-4 w-4" />
                      View My Listings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Leads</CardTitle>
                    <CardDescription>Latest customer inquiries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {leads.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No leads yet</p>
                        <p className="text-sm">Leads will appear here when customers inquire about your properties.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {leads.slice(0, 5).map((lead) => (
                          <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.phone}</p>
                            </div>
                            <Badge variant={lead.status === "new" ? "default" : "secondary"}>{lead.status}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Properties Tab */}
          {activeTab === "properties" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-serif font-bold mb-2">My Properties</h2>
                  <p className="text-muted-foreground">Manage your property listings</p>
                </div>
                <Button onClick={() => setShowAddProperty(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Property
                </Button>
              </div>

              {properties.length === 0 ? (
                <Card className="p-12 text-center">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2">No properties listed yet</h3>
                  <p className="text-muted-foreground mb-4">Start by adding your first property listing.</p>
                  <Button onClick={() => setShowAddProperty(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Property
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden">
                      <div className="relative aspect-video bg-muted">
                        {property.images?.[0] ? (
                          <img
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}
                        <Badge
                          className={`absolute top-2 right-2 ${
                            property.approval_status === "approved"
                              ? "bg-green-500"
                              : property.approval_status === "rejected"
                                ? "bg-red-500"
                                : "bg-amber-500"
                          }`}
                        >
                          {property.approval_status || "pending"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.location || "Location not set"}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-bold text-accent">
                            {property.price ? `₹${(property.price / 100000).toFixed(2)}L` : "Price on request"}
                          </span>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            {property.view_count || 0}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Leads Tab */}
          {activeTab === "leads" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold mb-2">My Leads</h2>
                <p className="text-muted-foreground">Manage customer inquiries and follow-ups</p>
              </div>

              {leads.length === 0 ? (
                <Card className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2">No leads yet</h3>
                  <p className="text-muted-foreground">Customer inquiries will appear here.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <Card key={lead.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{lead.name}</h3>
                              <Badge
                                variant={
                                  lead.status === "new"
                                    ? "default"
                                    : lead.status === "converted"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {lead.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {lead.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {lead.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(lead.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {lead.message && <p className="mt-3 text-sm bg-muted/50 p-3 rounded-lg">{lead.message}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={lead.status}
                              onValueChange={(value) => handleUpdateLeadStatus(lead.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" asChild>
                              <a href={`tel:${lead.phone}`}>
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Earnings Tab */}
          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold mb-2">Earnings & Commissions</h2>
                <p className="text-muted-foreground">Track your earnings and commission history</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{((agent?.total_sales || 0) / 100000).toFixed(2)}L</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Commission Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{agent?.commission_rate || 2}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹0</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <IndianRupee className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Your commission history will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold mb-2">My Profile</h2>
                <p className="text-muted-foreground">Manage your agent profile and settings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Agency Name</Label>
                        <p className="font-medium">{agent?.agency_name || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Referral Code</Label>
                        <p className="font-medium font-mono">{agent?.referral_code || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">City</Label>
                        <p className="font-medium">{agent?.city || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Region</Label>
                        <p className="font-medium">{agent?.region || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">{agent?.phone || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <Badge variant={agent?.status === "approved" ? "default" : "secondary"}>
                          {agent?.status || "pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{agent?.rating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Reviews</span>
                      <span className="font-medium">{agent?.review_count || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Listings</span>
                      <span className="font-medium">{agent?.total_listings || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Leads</span>
                      <span className="font-medium">{agent?.total_leads || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Add Property Dialog */}
      <Dialog open={showAddProperty} onOpenChange={setShowAddProperty}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
            <DialogDescription>List a new property on OdiBrix platform</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddProperty} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={propertyForm.title}
                  onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                  placeholder="e.g., Luxury 3BHK Villa in Bhubaneswar"
                  required
                />
              </div>

              <div>
                <Label htmlFor="property_type">Property Type *</Label>
                <Select
                  value={propertyForm.property_type}
                  onValueChange={(v) => setPropertyForm({ ...propertyForm, property_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="farmhouse">Farmhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={propertyForm.category_id}
                  onValueChange={(v) => setPropertyForm({ ...propertyForm, category_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={propertyForm.price}
                  onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                  placeholder="5000000"
                />
              </div>

              <div>
                <Label htmlFor="area">Area (sq.ft)</Label>
                <Input
                  id="area"
                  type="number"
                  value={propertyForm.area_sqft}
                  onChange={(e) => setPropertyForm({ ...propertyForm, area_sqft: e.target.value })}
                  placeholder="1500"
                />
              </div>

              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={propertyForm.bedrooms}
                  onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })}
                  placeholder="3"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={propertyForm.bathrooms}
                  onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: e.target.value })}
                  placeholder="2"
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={propertyForm.location}
                  onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                  placeholder="e.g., Patia, Bhubaneswar"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={propertyForm.address}
                  onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                  placeholder="Full address with landmark"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                  placeholder="Describe the property features, nearby amenities, etc."
                  rows={4}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={propertyForm.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyForm({ ...propertyForm, amenities: [...propertyForm.amenities, amenity] })
                          } else {
                            setPropertyForm({
                              ...propertyForm,
                              amenities: propertyForm.amenities.filter((a) => a !== amenity),
                            })
                          }
                        }}
                        className="rounded"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Label>Property Images</Label>
                <MultiImageUpload images={propertyImages} onImagesChange={setPropertyImages} maxImages={10} />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowAddProperty(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Approval"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
