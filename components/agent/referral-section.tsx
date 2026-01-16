"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check, Share2, Users, TrendingUp, Gift } from "lucide-react"
import { generateReferralLink, getAgentReferrals, getReferralStats } from "@/lib/actions/agents"
import type { PropertyOwner } from "@/lib/types"

interface ReferralSectionProps {
  agentId: string
}

export function ReferralSection({ agentId }: ReferralSectionProps) {
  const [referralLink, setReferralLink] = useState("")
  const [referrals, setReferrals] = useState<PropertyOwner[]>([])
  const [stats, setStats] = useState({ totalReferrals: 0, brixEarned: 0 })
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      const link = await generateReferralLink(agentId)
      if (link) setReferralLink(link)

      const refList = await getAgentReferrals(agentId)
      setReferrals(refList)

      const stats = await getReferralStats(agentId)
      setStats(stats)
    }

    loadData()
  }, [agentId])

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast({
        title: "Copied",
        description: "Referral link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareLink = () => {
    if (referralLink && navigator.share) {
      navigator.share({
        title: "Join OdiBrix as a Property Owner",
        text: "List your properties and earn Brix rewards with OdiBrix Real Estate",
        url: referralLink,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="text-3xl font-bold">{stats.totalReferrals}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Brix Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Gift className="h-8 w-8 text-amber-500" />
              <div className="text-3xl font-bold">{stats.brixEarned}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="text-3xl font-bold">{stats.totalReferrals > 0 ? "85%" : "0%"}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link with property owners. You'll earn 20 Brix points for each successful referral.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="bg-muted" />
            <Button size="icon" variant="outline" onClick={handleCopyLink}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="outline" onClick={handleShareLink}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> Send this link to property owners you know. When they sign up and get verified,
              you'll automatically earn 20 Brix points per referral!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referred Property Owners</CardTitle>
          <CardDescription>{referrals.length} property owners referred</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No property owners referred yet. Share your link to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((owner) => (
                <div key={owner.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                  <div>
                    <p className="font-medium">{owner.full_name}</p>
                    <p className="text-sm text-muted-foreground">{owner.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {owner.city}, {owner.region}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">+20 Brix</p>
                    <Badge variant={owner.kyc_status === "verified" ? "default" : "secondary"} className="mt-1">
                      {owner.kyc_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
