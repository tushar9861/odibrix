"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { Loader2, AlertCircle, Home, Briefcase, CheckCircle2 } from "lucide-react"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [accountType, setAccountType] = useState<"customer" | "agent">("customer")
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

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

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
          data: {
            name: name,
            phone: phone,
            role: accountType, // Sets role as customer or agent
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        if (
          error.message.includes("provider") ||
          error.message.includes("not enabled") ||
          error.message.includes("Unsupported")
        ) {
          throw new Error("Google Sign-Up is currently unavailable. Please use email/password.")
        }
        throw error
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred with Google sign up")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <Image
              src="/images/odibrix-logo.jpg"
              alt="OdiBrix"
              width={100}
              height={100}
              className="rounded-full shadow-lg"
            />
          </Link>
          <h1 className="text-2xl font-serif font-bold mt-4">Join OdiBrix</h1>
          <p className="text-muted-foreground text-sm mt-1">Create your account today</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Choose your account type to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Tabs
              value={accountType}
              onValueChange={(v) => setAccountType(v as "customer" | "agent")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" className="gap-2">
                  <Home className="h-4 w-4" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="agent" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Agent
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="mt-4 space-y-3">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-sm font-medium text-primary mb-2">Customer Benefits:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Browse all properties
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Save favorites
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Book property visits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Get personalized recommendations
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="agent" className="mt-4 space-y-3">
                <div className="bg-accent/10 rounded-lg p-3">
                  <p className="text-sm font-medium text-accent mb-2">Agent Benefits:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      List and manage properties
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Connect with customers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Track leads and inquiries
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Earn commissions
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            {/* Google Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-3 text-sm font-medium bg-white hover:bg-gray-50 border-2"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or sign up with email
              </span>
            </div>

            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 6 chars"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
              {error && (
                <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {error}
                  </p>
                </div>
              )}
              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  `Create ${accountType === "customer" ? "Customer" : "Agent"} Account`
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground block">
                Back to Website
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
