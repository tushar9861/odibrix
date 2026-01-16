"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Phone, Mail, MapPin, Globe } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [contactSettings, setContactSettings] = useState({
    supportPhone: "8763022010",
    salesPhone: "9778561010",
    email: "info@odibrix.com",
    address: "Station Road, Baleshwar, Odisha 756001",
    website: "www.odibrix.com",
  })
  const [pricingSettings, setPricingSettings] = useState({
    floorPlanPrice: "1499",
  })

  const handleContactSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          settings: contactSettings,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save contact settings")
      }

      toast({
        title: "Success",
        description: "Contact settings updated successfully",
      })
    } catch (error) {
      console.error("[v0] Contact settings error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save contact settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePricingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pricing",
          settings: pricingSettings,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save pricing")
      }

      toast({
        title: "Success",
        description: "Pricing updated successfully",
      })
    } catch (error) {
      console.error("[v0] Pricing error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save pricing",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your website settings</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Update your business contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="support-phone"
                      value={contactSettings.supportPhone}
                      onChange={(e) => setContactSettings({ ...contactSettings, supportPhone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sales-phone">Sales Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="sales-phone"
                      value={contactSettings.salesPhone}
                      onChange={(e) => setContactSettings({ ...contactSettings, salesPhone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={contactSettings.email}
                    onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={contactSettings.address}
                    onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={contactSettings.website}
                    onChange={(e) => setContactSettings({ ...contactSettings, website: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Update service pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePricingSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="floor-plan-price">Floor Plan Consultancy Price (₹)</Label>
                <Input
                  id="floor-plan-price"
                  type="number"
                  value={pricingSettings.floorPlanPrice}
                  onChange={(e) => setPricingSettings({ ...pricingSettings, floorPlanPrice: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Pricing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
