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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { MultiImageUpload } from "@/components/ui/multi-image-upload"
import { Checkbox } from "@/components/ui/checkbox"
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
  AlertCircle,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { Agent, Property, Lead } from "@/lib/types"
import { createProperty } from "@/lib/actions/properties"
import { useToast } from "@/hooks/use-toast"

interface AgentDashboardProps {
  user: User
  agent: Agent | null
  properties: Property[]
  leads: Lead[]
  categories: any[]
}

export function AgentDashboardClient({ user, agent, properties, leads, categories }: AgentDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [propertyImages, setPropertyImages] = useState<string[]>([])
  const [propertyDocuments, setPropertyDocuments] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const [leadsFilter, setLeadsFilter] = useState<"all" | "daily" | "weekly" | "monthly">("all")
  const [leadsSearch, setLeadsSearch] = useState("")

  // Property form state with lat/lng
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
    lat: "",
    lng: "",
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

  const filterLeadsByDate = (leadsToFilter: Lead[]) => {
    const now = new Date()
    let filtered = leadsToFilter

    if (leadsFilter === "daily") {
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      filtered = leadsToFilter.filter((l) => new Date(l.created_at) >= dayAgo)
    } else if (leadsFilter === "weekly") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = leadsToFilter.filter((l) => new Date(l.created_at) >= weekAgo)
    } else if (leadsFilter === "monthly") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = leadsToFilter.filter((l) => new Date(l.created_at) >= monthAgo)
    }

    // Apply search filter
    if (leadsSearch) {
      filtered = filtered.filter(
        (l) =>
          l.name?.toLowerCase().includes(leadsSearch.toLowerCase()) ||
          l.phone?.includes(leadsSearch) ||
          l.email?.toLowerCase().includes(leadsSearch.toLowerCase()),
      )
    }

    return filtered
  }

  const filteredLeads = filterLeadsByDate(leads)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validation
    if (propertyImages.length < 3) {
      setFormError("Please upload at least 3 images of the property")
      return
    }

    if (propertyDocuments.length < 1) {
      setFormError("Please upload at least 1 property document (ownership proof, permission, etc.)")
      return
    }

    if (!propertyForm.lat || !propertyForm.lng) {
      setFormError("Please enter the property's latitude and longitude coordinates")
      return
    }

    const lat = Number.parseFloat(propertyForm.lat)
    const lng = Number.parseFloat(propertyForm.lng)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setFormError("Please enter valid latitude (-90 to 90) and longitude (-180 to 180) coordinates")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createProperty({
        title: propertyForm.title,
        description: propertyForm.description,
        property_type: propertyForm.property_type,
        price: propertyForm.price,
        area_sqft: propertyForm.area_sqft,
        bedrooms: propertyForm.bedrooms,
        bathrooms: propertyForm.bathrooms,
        location: propertyForm.location,
        address: propertyForm.address,
        category_id: propertyForm.category_id,
        lat: propertyForm.lat,
        lng: propertyForm.lng,
        amenities: propertyForm.amenities,
        images: propertyImages,
        documents: propertyDocuments,
      })

      if (!result.success) {
        setFormError(result.error || "Failed to add property")
        toast({
          title: "Error",
          description: result.error || "Failed to add property",
          variant: "destructive",
        })
        return
      }

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
        lat: "",
        lng: "",
        amenities: [],
      })
      setPropertyImages([])
      setPropertyDocuments([])

      toast({
        title: "Success",
        description: "Property submitted for approval. You'll be notified when it's reviewed.",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Property submission error:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to add property"
      setFormError(errorMsg)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
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

  const handleCallLead = async (lead: Lead) => {
    try {
      const supabase = createClient()
      await supabase
        .from("leads")
        .update({
          call_count: (lead.call_count || 0) + 1,
          last_called_at: new Date().toISOString(),
          contact_number_shown: true,
        })
        .eq("id", lead.id)

      // Open phone dialer
      window.location.href = `tel:${lead.phone}`
    } catch (error) {
      console.error("Error tracking call:", error)
      // Still open dialer even if tracking fails
      window.location.href = `tel:${lead.phone}`
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

  // Check if agent is approved
  const isApproved = agent?.status === "approved"

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

          {/* Agent Status Banner */}
          {agent && agent.status !== "approved" && (
            <div
              className={`mx-4 mt-4 p-3 rounded-lg text-sm ${
                agent.status === "pending"
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <p className="font-medium">
                {agent.status === "pending" ? "Account Pending Approval" : "Account Suspended"}
              </p>
              <p className="text-xs mt-1">
                {agent.status === "pending"
                  ? "Your account is under review. You can add properties after approval."
                  : agent.suspension_reason || "Please contact support."}
              </p>
            </div>
          )}

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
      <main className="lg:ml-64 p-4 lg:p-8">
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
                      disabled={!isApproved}
                    >
                      <Plus className="h-4 w-4" />
                      Add New Property Listing
                      {!isApproved && (
                        <Badge variant="secondary" className="ml-auto">
                          Pending Approval
                        </Badge>
                      )}
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
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.phone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={lead.status === "new" ? "default" : "secondary"}>{lead.status}</Badge>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleCallLead(lead)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
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
                <Button onClick={() => setShowAddProperty(true)} className="gap-2" disabled={!isApproved}>
                  <Plus className="h-4 w-4" />
                  Add Property
                </Button>
              </div>

              {!isApproved && (
                <Card className="mb-6 border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-800">Account Pending Approval</p>
                        <p className="text-sm text-amber-700">
                          You will be able to add properties once your account is approved by admin.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {properties.length === 0 ? (
                <Card className="p-12 text-center">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2">No properties listed yet</h3>
                  <p className="text-muted-foreground mb-4">Start by adding your first property listing.</p>
                  <Button onClick={() => setShowAddProperty(true)} className="gap-2" disabled={!isApproved}>
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

          {/* Leads Tab - Enhanced with filtering and call UI */}
          {activeTab === "leads" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold mb-2">My Leads</h2>
                <p className="text-muted-foreground">Manage customer inquiries and follow-ups</p>
              </div>

              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Search by name, phone, or email..."
                        value={leadsSearch}
                        onChange={(e) => setLeadsSearch(e.target.value)}
                        className="pl-10"
                      />
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select value={leadsFilter} onValueChange={(v: any) => setLeadsFilter(v)}>
                      <SelectTrigger className="w-full md:w-[150px]">
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="daily">Last 24 Hours</SelectItem>
                        <SelectItem value="weekly">Last 7 Days</SelectItem>
                        <SelectItem value="monthly">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {filteredLeads.length === 0 ? (
                <Card className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2">No leads found</h3>
                  <p className="text-muted-foreground">
                    {leadsFilter !== "all" || leadsSearch
                      ? "Try adjusting your filters."
                      : "Customer inquiries will appear here."}
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead) => (
                    <Card key={lead.id}>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{lead.name}</h3>
                              <Badge
                                variant={
                                  lead.status === "new"
                                    ? "default"
                                    : lead.status === "contacted"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {lead.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(lead.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {lead.message && <p className="mt-2 text-sm bg-muted/50 p-2 rounded">{lead.message}</p>}
                          </div>

                          <div className="flex items-center gap-2">
                            <Select value={lead.status} onValueChange={(v) => handleUpdateLeadStatus(lead.id, v)}>
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              size="icon"
                              variant="default"
                              className="h-10 w-10 bg-green-600 hover:bg-green-700"
                              onClick={() => handleCallLead(lead)}
                              title="Call customer"
                            >
                              <Phone className="h-5 w-5" />
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
                <h2 className="text-3xl font-serif font-bold mb-2">Earnings & Commission</h2>
                <p className="text-muted-foreground">Track your income and Brix points</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Total Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ₹{(((agent?.total_sales || 0) * (agent?.commission_rate || 2)) / 100).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {agent?.commission_rate || 2}% commission</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Total Sales Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{(Number(agent?.total_sales || 0) / 100000).toFixed(2)}L</div>
                    <p className="text-sm text-muted-foreground">Properties sold through you</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <CardHeader>
                    <CardTitle className="text-sm text-white/80">Brix Points Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.brixPoints}</div>
                    <p className="text-sm text-white/80">
                      {stats.brixPoints >= 1000
                        ? "30% discount available!"
                        : `${1000 - stats.brixPoints} points to unlock 30% discount`}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Brix Points Discount System</CardTitle>
                  <CardDescription>Earn points and get discounts on platform fees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Current Discount</p>
                        <p className="text-sm text-muted-foreground">Based on your Brix points</p>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {Math.min(Math.floor((stats.brixPoints / 1000) * 30), 30)}% OFF
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">How to earn Brix points:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>50 points - Welcome bonus on registration</li>
                        <li>100 points - Each approved property listing</li>
                        <li>200 points - Each successful deal closure</li>
                        <li>500 points - Best Agent of the Month award</li>
                        <li>Bonus points - Admin rewards for exceptional performance</li>
                      </ul>
                    </div>
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
                <p className="text-muted-foreground">View and manage your profile information</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-muted mb-4">
                      {agent?.profile_image ? (
                        <img
                          src={agent.profile_image || "/placeholder.svg"}
                          alt={agentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                          {agentName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold">{agentName}</h3>
                    <p className="text-muted-foreground">{agent?.agency_name}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{agent?.rating?.toFixed(1) || "0.0"}</span>
                      <span className="text-muted-foreground">({agent?.review_count || 0} reviews)</span>
                    </div>
                    <Badge className="mt-3" variant={agent?.status === "approved" ? "default" : "secondary"}>
                      {agent?.status || "pending"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">{agent?.phone || "Not set"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">City</Label>
                        <p className="font-medium">{agent?.city || "Not set"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Region</Label>
                        <p className="font-medium">{agent?.region || "Not set"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Referral Code</Label>
                        <p className="font-medium font-mono">{agent?.referral_code || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Member Since</Label>
                        <p className="font-medium">
                          {agent?.created_at ? new Date(agent.created_at).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                    {agent?.bio && (
                      <div>
                        <Label className="text-muted-foreground">Bio</Label>
                        <p className="mt-1">{agent.bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Add Property Dialog - Enhanced with lat/lng, min 3 images, documents */}
      <Dialog open={showAddProperty} onOpenChange={setShowAddProperty}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
            <DialogDescription>Fill in the property details. All fields marked with * are required.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddProperty} className="space-y-6">
            {formError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {formError}
                </p>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-medium">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={propertyForm.title}
                  onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                  placeholder="e.g., Modern 3BHK Apartment in Prime Location"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
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
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="office">Office Space</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                  placeholder="Describe the property in detail..."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Pricing & Specs */}
            <div className="space-y-4">
              <h3 className="font-medium">Pricing & Specifications</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={propertyForm.price}
                    onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                    placeholder="5000000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq.ft) *</Label>
                  <Input
                    id="area"
                    type="number"
                    value={propertyForm.area_sqft}
                    onChange={(e) => setPropertyForm({ ...propertyForm, area_sqft: e.target.value })}
                    placeholder="1200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={propertyForm.bedrooms}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })}
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={propertyForm.bathrooms}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: e.target.value })}
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-medium">Location Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location/Area *</Label>
                  <Input
                    id="location"
                    value={propertyForm.location}
                    onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                    placeholder="e.g., Saheed Nagar, Bhubaneswar"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    value={propertyForm.address}
                    onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                    placeholder="Complete address with landmark"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">
                    Latitude * <span className="text-xs text-muted-foreground">(e.g., 20.2961)</span>
                  </Label>
                  <Input
                    id="lat"
                    type="text"
                    value={propertyForm.lat}
                    onChange={(e) => setPropertyForm({ ...propertyForm, lat: e.target.value })}
                    placeholder="20.2961"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">
                    Longitude * <span className="text-xs text-muted-foreground">(e.g., 85.8245)</span>
                  </Label>
                  <Input
                    id="lng"
                    type="text"
                    value={propertyForm.lng}
                    onChange={(e) => setPropertyForm({ ...propertyForm, lng: e.target.value })}
                    placeholder="85.8245"
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Get coordinates from Google Maps: Right-click on location → "What's here?" → Copy the numbers
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">
                Property Images *
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Minimum 3 images required, {propertyImages.length}/3 uploaded)
                </span>
              </h3>
              <MultiImageUpload values={propertyImages} onChange={setPropertyImages} maxImages={10} />
              {propertyImages.length < 3 && (
                <p className="text-sm text-amber-600">Please upload at least 3 images of the property</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">
                Property Documents *
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Ownership proof, permission documents, etc.)
                </span>
              </h3>
              <MultiImageUpload
                values={propertyDocuments}
                onChange={setPropertyDocuments}
                maxImages={5}
                label="Upload property documents"
              />
              {propertyDocuments.length < 1 && (
                <p className="text-sm text-amber-600">Please upload at least 1 property document</p>
              )}
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="font-medium">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={propertyForm.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPropertyForm({
                            ...propertyForm,
                            amenities: [...propertyForm.amenities, amenity],
                          })
                        } else {
                          setPropertyForm({
                            ...propertyForm,
                            amenities: propertyForm.amenities.filter((a) => a !== amenity),
                          })
                        }
                      }}
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddProperty(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Property"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
