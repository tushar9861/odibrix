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
import { Loader2, AlertCircle, Home, Briefcase } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [accountType, setAccountType] = useState<"customer" | "agent">("customer")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // Secret admin redirect - only you know this
      if (email === "odibrix@gmail.com" && password === "Tushar@Das") {
        router.push("/admin")
      } else if (accountType === "agent") {
        router.push("/agent/dashboard")
      } else {
        router.push("/")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
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
          throw new Error("Google Sign-In is currently unavailable. Please use email/password.")
        }
        throw error
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred with Google sign in")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image
              src="/images/odibrix-logo.jpg"
              alt="OdiBrix"
              width={100}
              height={100}
              className="rounded-full shadow-lg"
            />
          </Link>
          <h1 className="text-2xl font-serif font-bold mt-4">Welcome to OdiBrix</h1>
          <p className="text-muted-foreground text-sm mt-1">Your Premium Real Estate Partner</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

              <TabsContent value="customer" className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Sign in to browse properties, save favorites, and book visits
                </p>
              </TabsContent>

              <TabsContent value="agent" className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Sign in to manage your listings and connect with customers
                </p>
              </TabsContent>
            </Tabs>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 gap-3 text-base font-medium bg-white hover:bg-gray-50 border-2"
              onClick={handleGoogleLogin}
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
                or sign in with email
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                </div>
              )}
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  `Sign In as ${accountType === "customer" ? "Customer" : "Agent"}`
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary font-medium hover:underline">
                  Create Account
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
