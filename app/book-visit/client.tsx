"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, MapPin, Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { createLead } from "@/lib/actions/leads"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function BookVisitClientPage() {
  const [visitType, setVisitType] = useState<"virtual" | "physical">("virtual")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [salesPhone, setSalesPhone] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      lead_type: "book_visit" as const,
      visit_type: visitType,
      preferred_date: formData.get("date") as string,
      preferred_time: formData.get("time") as string,
      property_interest: formData.get("property") as string,
      message: formData.get("message") as string,
    }

    const result = await createLead(data)

    if (result.success) {
      setIsSubmitted(true)
      setSalesPhone("9778561010")
    } else {
      setError(result.error || "Failed to submit. Please try again.")
    }
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-serif font-bold mb-4">Visit Scheduled!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for booking a {visitType} visit with OdiBrix. Our team will contact you shortly to confirm the
                details.
              </p>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Your Sales Representative</p>
                  <p className="text-2xl font-bold text-primary">{salesPhone}</p>
                  <p className="text-sm text-muted-foreground mt-2">Feel free to call for any queries</p>
                </CardContent>
              </Card>
              <Button className="mt-8" onClick={() => setIsSubmitted(false)}>
                Book Another Visit
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Book a Property Visit</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose between a virtual 3D tour from anywhere or schedule an in-person visit to explore your dream
              property.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-2xl mx-auto">
            <Tabs defaultValue="virtual" onValueChange={(v) => setVisitType(v as "virtual" | "physical")}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="virtual" className="gap-2">
                  <Video className="w-4 h-4" />
                  Virtual Visit
                </TabsTrigger>
                <TabsTrigger value="physical" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  Physical Visit
                </TabsTrigger>
              </TabsList>

              <Card>
                <CardHeader>
                  <CardTitle>{visitType === "virtual" ? "Schedule Virtual Tour" : "Schedule Physical Visit"}</CardTitle>
                  <CardDescription>
                    {visitType === "virtual"
                      ? "Experience our properties through immersive 3D walkthroughs from the comfort of your home."
                      : "Visit the property in person with our expert guide."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" name="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="Your phone" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" placeholder="your@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property">Property Interest</Label>
                      <Select name="property">
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="home">Single Home</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                          <SelectItem value="rent">Rental Property</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="date" name="date" type="date" className="pl-10" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time *</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="time" name="time" type="time" className="pl-10" required />
                        </div>
                      </div>
                    </div>

                    {visitType === "physical" && (
                      <div className="space-y-2">
                        <Label htmlFor="address">Your Address (for pickup, optional)</Label>
                        <Textarea
                          id="address"
                          name="address"
                          placeholder="Enter your address if you need pickup service"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Notes</Label>
                      <Textarea id="message" name="message" placeholder="Any specific requirements or questions?" />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scheduling...
                        </>
                      ) : visitType === "virtual" ? (
                        "Schedule Virtual Tour"
                      ) : (
                        "Schedule Physical Visit"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
