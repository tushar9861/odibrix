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
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, Upload, ArrowRight, Shield, Clock, FileText, Loader2 } from "lucide-react"
import { createLead } from "@/lib/actions/leads"
import { PaymentForm } from "@/components/payment/payment-form"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

type Step = "form" | "payment" | "success"

export default function GetFloorPlanPage() {
  const [step, setStep] = useState<Step>("form")
  const [salesPhone, setSalesPhone] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agreedToTerms) return
    setIsLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      lead_type: "floor_plan" as const,
      property_interest: form.get("property-type") as string,
      plot_size: form.get("area") as string,
      budget: form.get("budget") as string,
      message: form.get("requirements") as string,
    }

    const result = await createLead(data)

    if (result.success) {
      setLeadId(result.data?.id)
      setStep("payment")
    } else {
      setError(result.error || "Failed to submit. Please try again.")
    }
    setIsLoading(false)
  }

  const handlePaymentSuccess = (txnId: string) => {
    setTransactionId(txnId)
    setSalesPhone("9778561010")
    setStep("success")
  }

  if (step === "success") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-serif font-bold mb-4">Payment Successful!</h1>
              <p className="text-muted-foreground mb-4">
                Thank you for booking our Expert Consultancy. Your floor plan and estimation will be delivered within 3
                business days.
              </p>
              {transactionId && <p className="text-sm text-muted-foreground mb-8">Transaction ID: {transactionId}</p>}

              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">What Happens Next?</h3>
                  <ul className="text-left space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>You will receive a confirmation email with order details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Our expert team will analyze your requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Floor plan & estimation delivered within 3 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Schedule your 30-minute consultation call</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <p className="text-sm opacity-80 mb-2">Your Sales Representative</p>
                  <p className="text-3xl font-bold">{salesPhone}</p>
                  <p className="text-sm opacity-80 mt-2">Feel free to call for any queries</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (step === "payment") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-serif font-bold mb-4">Complete Payment</h1>
                <p className="text-muted-foreground">Secure payment for your Expert Consultancy package</p>
              </div>

              {/* Order Summary */}
              <Card className="max-w-md mx-auto mb-6">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Expert Consultancy Package</p>
                      <p className="text-sm text-muted-foreground">Floor Plan + Estimation + 30-min Call</p>
                    </div>
                    <p className="text-xl font-bold">₹1,499</p>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>3-day delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Full refund guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PaymentForm
                amount={1499}
                paymentType="floor_plan"
                leadId={leadId || undefined}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setStep("form")}
              />
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get Your Floor Plan & Estimation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book our ₹1,499 Expert Consultancy and receive a complimentary basic floor plan and a personalised
              estimation — delivered within 3 business days.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Tell Us About Your Property</CardTitle>
                <CardDescription>
                  Fill in the details below and our experts will prepare your floor plan and estimation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
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
                    <Label htmlFor="property-type">Property Type *</Label>
                    <Select name="property-type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential-new">New Residential Construction</SelectItem>
                        <SelectItem value="residential-renovation">Residential Renovation</SelectItem>
                        <SelectItem value="commercial-new">New Commercial Construction</SelectItem>
                        <SelectItem value="commercial-renovation">Commercial Renovation</SelectItem>
                        <SelectItem value="land-development">Land Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Property Address / Location *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter the property location or address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">Approximate Area (sq ft)</Label>
                      <Input id="area" name="area" type="number" placeholder="e.g., 1500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select name="budget">
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-25">Under ₹25 Lakhs</SelectItem>
                          <SelectItem value="25-50">₹25 - 50 Lakhs</SelectItem>
                          <SelectItem value="50-1cr">₹50 Lakhs - 1 Crore</SelectItem>
                          <SelectItem value="1cr-plus">Above ₹1 Crore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Upload Existing Plan (optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                      <Input id="file" name="file" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Additional Requirements</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      placeholder="Any specific requirements or preferences for your floor plan?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Contact Method</Label>
                    <Select name="contact-method">
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the Terms of Service and Privacy Policy *
                      </label>
                      <p className="text-xs text-muted-foreground">
                        I consent to be contacted by OdiBrix via phone, SMS, or email regarding my enquiry.
                      </p>
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={!agreedToTerms || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Continue to Payment (₹1,499)
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Secure checkout. Your information is protected.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
