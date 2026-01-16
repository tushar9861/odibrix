"use client"

import { useState, useEffect } from "react"
import { redirect, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getPropertyOwner, getOwnerProperties, getOwnerLeads } from "@/lib/actions/owners"
import { Home, Users, Eye, Settings, LogOut, Plus, MapPin, Phone, Mail, AlertCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { PropertyOwner, Property, Lead } from "@/lib/types"

export default function OwnerDashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [owner, setOwner] = useState<PropertyOwner | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          redirect("/auth/login")
        }

        setUser(user)

        const ownerData = await getPropertyOwner(user.id)
        if (!ownerData) {
          redirect("/auth/sign-up?type=owner")
        }

        setOwner(ownerData)

        const propertiesData = await getOwnerProperties(ownerData.id)
        setProperties(propertiesData)

        const leadsData = await getOwnerLeads(ownerData.id)
        setLeads(leadsData)

        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Dashboard load error:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [toast])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "properties", label: "My Properties", icon: Home },
    { id: "leads", label: "Leads", icon: Users },
    { id: "profile", label: "Settings", icon: Settings },
  ]

  if (isLoading) {
    return <div className="pt-32 pb-20 text-center">Loading owner portal...</div>
  }

  if (!owner) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 pt-20 pb-12 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Owner Portal</h1>
            <p className="text-muted-foreground">Manage your properties and track leads</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* KYC Status Alert */}
        {owner.kyc_status !== "verified" && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="font-medium text-amber-800">KYC Verification Pending</p>
                  <p className="text-sm text-amber-700">
                    Your KYC documents are under review. Please keep your details updated.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{properties.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Interested customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{properties.reduce((sum, p) => sum + (p.view_count || 0), 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Property impressions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">KYC Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={owner.kyc_status === "verified" ? "default" : "secondary"}>{owner.kyc_status}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                activeTab === item.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 inline mr-2" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  {leads.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No leads yet</p>
                  ) : (
                    <div className="space-y-3">
                      {leads.slice(0, 5).map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.phone}</p>
                          </div>
                          <Badge>{lead.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{owner.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{owner.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{owner.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <Badge>{owner.priority_label}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {properties.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-muted-foreground mb-4">No properties listed yet</p>
                <Link href="/agent/dashboard">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    List a Property
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id}>
                    <div className="aspect-video bg-muted overflow-hidden">
                      {property.images?.[0] && (
                        <img
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{property.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-lg font-bold text-accent">₹{(property.price || 0) / 100000}L</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
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
            {leads.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-muted-foreground">No leads yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <Card key={lead.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{lead.name}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground mt-2">
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {lead.phone}
                            </p>
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {lead.email}
                            </p>
                          </div>
                        </div>
                        <Badge>{lead.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{owner.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{owner.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{owner.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{owner.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium">{owner.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Status</p>
                    <Badge variant={owner.status === "active" ? "default" : "secondary"}>{owner.status}</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Bio</p>
                  <p className="text-sm">{owner.bio || "No bio added yet"}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
