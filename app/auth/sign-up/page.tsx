"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Loader2, AlertCircle, Home, Briefcase, Building2, CheckCircle2 } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import { registerAgent } from "@/lib/actions/agents"
import { registerPropertyOwner } from "@/lib/actions/owners"

const REGIONS = [
  "Bhubaneswar",
  "Cuttack",
  "Puri",
  "Rourkela",
  "Sambalpur",
  "Berhampur",
  "Balasore",
  "Baripada",
  "Jharsuguda",
  "Angul",
  "Other Odisha",
  "Outside Odisha",
]

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [accountType, setAccountType] = useState<"customer" | "agent" | "owner">("customer")
  const router = useRouter()
  const { toast } = useToast()

  // Agent-specific fields
  const [agencyName, setAgencyName] = useState("")
  const [city, setCity] = useState("")
  const [region, setRegion] = useState("")
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [kycType, setKycType] = useState("")
  const [kycDocumentUrl, setKycDocumentUrl] = useState("")
  const [alternatePhone, setAlternatePhone] = useState("")

  // Owner-specific fields
  const [fullName, setFullName] = useState("")
  const [address, setAddress] = useState("")
  const [ownerCity, setOwnerCity] = useState("")
  const [ownerRegion, setOwnerRegion] = useState("")
  const [ownerKycType, setOwnerKycType] = useState("")
  const [ownerKycDocument, setOwnerKycDocument] = useState("")
  const [propertyPapers, setPropertyPapers] = useState<string[]>([])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!email || !password) {
      setError("Email and password are required")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    // Validation based on account type
    if (accountType === "agent") {
      if (!profileImage) {
        setError("Profile photo is required for agent registration")
        setIsLoading(false)
        return
      }
      if (!kycType || !kycDocumentUrl) {
        setError("KYC document is required for agent registration")
        setIsLoading(false)
        return
      }
      if (!city || !region) {
        setError("City and region are required for agent registration")
        setIsLoading(false)
        return
      }
    }

    if (accountType === "owner") {
      if (!fullName || !address || !ownerCity || !ownerRegion) {
        setError("All property owner details are required")
        setIsLoading(false)
        return
      }
      if (!ownerKycType || !ownerKycDocument) {
        setError("KYC document is required for property owner registration")
        setIsLoading(false)
        return
      }
      if (propertyPapers.length === 0) {
        setError("At least one property document is required")
        setIsLoading(false)
        return
      }
    }

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
          data: {
            name: accountType === "owner" ? fullName : name,
            account_type: accountType,
          },
        },
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error("Failed to create account")
      }

      // Create additional records based on account type
      if (accountType === "agent") {
        const result = await registerAgent({
          userId: authData.user.id,
          agencyName: agencyName || name,
          city,
          region,
          phone,
          alternatePhone,
          bio,
          specialization: [],
        })

        if (!result.success) {
          setError(result.error || "Failed to create agent profile")
          setIsLoading(false)
          return
        }

        toast({
          title: "Agent Account Created",
          description: "Your registration is under review. You'll be notified when approved.",
        })
      } else if (accountType === "owner") {
        const result = await registerPropertyOwner({
          fullName,
          email,
          phone,
          kycType: ownerKycType,
          kycDocumentUrl: ownerKycDocument,
          propertyPapersUrl: propertyPapers,
          address,
          city: ownerCity,
          region: ownerRegion,
        })

        if (!result.success) {
          setError(result.error || "Failed to create owner profile")
          setIsLoading(false)
          return
        }

        toast({
          title: "Owner Account Created",
          description: "Your account has been created. Please verify your email to continue.",
        })
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred during sign up")
      console.error("[v0] Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex justify-center mb-4">
            <Image src="/images/odibrix-logo.jpg" alt="OdiBrix" width={80} height={80} className="rounded-full" />
          </Link>
          <h1 className="text-4xl font-serif font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join OdiBrix as a Customer, Agent, or Property Owner</p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive/20 bg-destructive/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <Tabs value={accountType} onValueChange={(v: any) => setAccountType(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Customer</span>
                </TabsTrigger>
                <TabsTrigger value="agent" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Agent</span>
                </TabsTrigger>
                <TabsTrigger value="owner" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Owner</span>
                </TabsTrigger>
              </TabsList>

              {/* Customer Tab */}
              <TabsContent value="customer">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Full Name</Label>
                    <Input
                      id="customer-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email Address</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Phone Number</Label>
                    <Input
                      id="customer-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-password">Password</Label>
                    <Input
                      id="customer-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-confirm">Confirm Password</Label>
                    <Input
                      id="customer-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Create Customer Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Agent Tab */}
              <TabsContent value="agent">
                <form onSubmit={handleSignUp} className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                  <div className="space-y-2">
                    <Label>Profile Photo *</Label>
                    <ImageUpload
                      values={profileImage ? [profileImage] : []}
                      onChange={(imgs) => setProfileImage(imgs[0] || "")}
                      maxImages={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-name">Full Name *</Label>
                    <Input
                      id="agent-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency-name">Agency/Company Name *</Label>
                    <Input
                      id="agency-name"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Your agency name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-email">Email Address *</Label>
                    <Input
                      id="agent-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-phone">Phone Number *</Label>
                    <Input
                      id="agent-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alt-phone">Alternate Phone</Label>
                    <Input
                      id="alt-phone"
                      type="tel"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agent-city">City *</Label>
                      <Input
                        id="agent-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Your city"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-region">Region *</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-bio">Bio</Label>
                    <Textarea
                      id="agent-bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about your experience..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kyc-type">KYC Type *</Label>
                    <Select value={kycType} onValueChange={setKycType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select KYC document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhar">Aadhar</SelectItem>
                        <SelectItem value="pan">PAN</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>KYC Document *</Label>
                    <ImageUpload
                      values={kycDocumentUrl ? [kycDocumentUrl] : []}
                      onChange={(imgs) => setKycDocumentUrl(imgs[0] || "")}
                      maxImages={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-password">Password *</Label>
                    <Input
                      id="agent-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-confirm">Confirm Password *</Label>
                    <Input
                      id="agent-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Create Agent Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Owner Tab */}
              <TabsContent value="owner">
                <form onSubmit={handleSignUp} className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Full Name *</Label>
                    <Input
                      id="owner-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-email">Email Address *</Label>
                    <Input
                      id="owner-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-phone">Phone Number *</Label>
                    <Input
                      id="owner-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-address">Property Address *</Label>
                    <Textarea
                      id="owner-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full address of your property"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner-city">City *</Label>
                      <Input
                        id="owner-city"
                        value={ownerCity}
                        onChange={(e) => setOwnerCity(e.target.value)}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-region">Region *</Label>
                      <Select value={ownerRegion} onValueChange={setOwnerRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-kyc">KYC Type *</Label>
                    <Select value={ownerKycType} onValueChange={setOwnerKycType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select KYC type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhar">Aadhar</SelectItem>
                        <SelectItem value="pan">PAN</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>KYC Document *</Label>
                    <ImageUpload
                      values={ownerKycDocument ? [ownerKycDocument] : []}
                      onChange={(imgs) => setOwnerKycDocument(imgs[0] || "")}
                      maxImages={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Documents (Ownership Proof, Permission, etc.) *</Label>
                    <ImageUpload
                      values={propertyPapers}
                      onChange={setPropertyPapers}
                      maxImages={5}
                      label="Upload property documents"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-password">Password *</Label>
                    <Input
                      id="owner-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-confirm">Confirm Password *</Label>
                    <Input
                      id="owner-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Create Owner Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-accent hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
