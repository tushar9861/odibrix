"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, FileText, Phone, ArrowRight, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const consultancyFeatures = [
  "Detailed basic floor plan for your property",
  "Professional cost estimation",
  "30-minute one-on-one consultation call",
  "Property valuation guidance",
  "Investment recommendations",
  "Delivered within 3 business days",
]

const process = [
  {
    step: 1,
    title: "Submit Your Details",
    description: "Fill out the form with your property requirements and contact information.",
  },
  {
    step: 2,
    title: "Make Payment",
    description: "Complete the secure payment of ₹1,499 for the consultancy package.",
  },
  {
    step: 3,
    title: "Expert Analysis",
    description: "Our experts analyze your requirements and prepare your floor plan.",
  },
  {
    step: 4,
    title: "Receive Deliverables",
    description: "Get your floor plan, estimation, and schedule your consultation call.",
  },
]

export default function ConsultPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Expert Consultancy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get professional guidance for your property journey with our comprehensive consultancy package.
            </p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-xl mx-auto mb-20">
            <Card className="border-2 border-accent overflow-hidden">
              <div className="bg-accent text-accent-foreground p-4 text-center">
                <p className="text-sm font-medium">Most Popular</p>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Professional Consultancy</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">₹1,499</span>
                  <span className="text-muted-foreground ml-2">one-time</span>
                </div>
                <CardDescription className="mt-2 flex items-center justify-center gap-1">
                  Includes complimentary floor plan & estimation
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Producing professional floor plans & estimations requires expert work. The ₹1,499 covers the
                          consultancy service, and the floor plan is included as a promotional offer with your purchase.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3 mb-8">
                  {consultancyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/get-floor-plan">
                  <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Book Consultancy
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  No hidden charges. Upgrade options available for detailed 3D floor plans.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Process */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-20">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <motion.div key={index} variants={fadeInUp} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What You Get */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <h2 className="text-3xl font-serif font-bold text-center mb-12">What You Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Floor Plan</h3>
                    <p className="text-muted-foreground">
                      A professionally designed basic floor plan tailored to your property specifications.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">₹</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Cost Estimation</h3>
                    <p className="text-muted-foreground">
                      Detailed breakdown of expected costs for construction or renovation.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                      <Phone className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Expert Call</h3>
                    <p className="text-muted-foreground">
                      30-minute consultation call with our real estate expert for personalized guidance.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
