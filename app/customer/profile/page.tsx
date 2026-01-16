"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Edit, Save, Award } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

export default function CustomerProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")
  const [brixPoints, setBrixPoints] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      setDisplayName(user.user_metadata?.name || "")
      setPhone(user.user_metadata?.phone || "")
      // TODO: Fetch actual Brix points from database
      setBrixPoints(0)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleUpdateProfile = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        data: {
          name: displayName,
          phone: phone,
        },
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return <div className="pt-32 pb-20 text-center">Loading profile...</div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and Brix rewards</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Account Information</CardTitle>
              {!isEditing && (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user.email || ""} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleUpdateProfile} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Brix Rewards Card */}
          <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                <CardTitle>Brix Rewards</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Your Brix Points Balance</p>
                <p className="text-5xl font-bold text-accent">{brixPoints}</p>
              </div>

              <div className="bg-white/50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold">How to Earn Brix Points:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Earn points on successful property rentals or purchases</li>
                  <li>• Get referral bonuses when you refer friends</li>
                  <li>• Participate in OdiBrix promotions</li>
                </ul>
              </div>

              <div className="bg-white/50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold">Redeem Your Points:</h3>
                <p className="text-sm text-muted-foreground">
                  Use your Brix points to get discounts on rental properties. 1000 points = up to 30% discount!
                </p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={brixPoints === 0}>
                  View Rental Deals
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Brix History */}
          <Card>
            <CardHeader>
              <CardTitle>Brix Points History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">No Brix points transactions yet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
