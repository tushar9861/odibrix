import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Globe } from "lucide-react"

export default function SettingsPage() {
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="support-phone">Support Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="support-phone" defaultValue="8763022010" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sales-phone">Sales Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="sales-phone" defaultValue="9778561010" className="pl-10" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" defaultValue="info@odibrix.com" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  defaultValue="Station Road, Baleshwar, Odisha 756001"
                  className="pl-10 min-h-[80px]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="website" defaultValue="www.odibrix.com" className="pl-10" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Update service pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="floor-plan-price">Floor Plan Consultancy Price (₹)</Label>
              <Input id="floor-plan-price" type="number" defaultValue="1499" />
            </div>
            <Button>Save Pricing</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
