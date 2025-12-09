"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Calendar,
  Phone,
  Video,
  Box,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { createLead } from "@/lib/actions/leads"

const ModelViewer = dynamic(() => import("@/components/3d/model-viewer").then((mod) => mod.ModelViewer), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-muted rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  ),
})

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// Mock property data
const propertiesData: Record<
  string,
  {
    id: string
    title: string
    location: string
    address: string
    price: string
    type: string
    status: string
    beds: number
    baths: number
    area: number
    description: string
    features: string[]
    images: string[]
    lat: number
    lng: number
    has3D: boolean
  }
> = {
  "1": {
    id: "1",
    title: "Modern 3BHK Apartment",
    location: "Baleshwar Town, Odisha",
    address: "Plot No. 45, Sahadevkhunta, Baleshwar Town, Odisha 756001",
    price: "₹45,00,000",
    type: "apartment",
    status: "available",
    beds: 3,
    baths: 2,
    area: 1450,
    description:
      "A beautifully designed 3BHK apartment in the heart of Baleshwar Town. This property offers modern amenities, spacious rooms, and excellent connectivity to schools, hospitals, and markets. The apartment features premium flooring, modular kitchen, and ample natural lighting.",
    features: [
      "Modular Kitchen",
      "24/7 Water Supply",
      "Power Backup",
      "Parking Space",
      "Security",
      "Lift",
      "Children's Play Area",
      "Gym",
    ],
    images: ["/images/home-20v5.jpeg", "/images/home-20v6.jpeg", "/images/home-20v1.jpeg"],
    lat: 21.4934,
    lng: 86.9135,
    has3D: true,
  },
  "2": {
    id: "2",
    title: "Premium Villa with Garden",
    location: "Chandipur, Odisha",
    address: "Beach Road, Chandipur, Baleshwar District, Odisha 756025",
    price: "₹1,20,00,000",
    type: "home",
    status: "available",
    beds: 4,
    baths: 3,
    area: 2800,
    description:
      "Luxurious villa located near the famous Chandipur Beach. This property features a beautiful garden, private parking, and stunning sea views. Perfect for families looking for a peaceful retreat with all modern amenities.",
    features: [
      "Private Garden",
      "Sea View",
      "Covered Parking",
      "Servant Quarters",
      "Terrace",
      "Modern Security",
      "Solar Panels",
      "Rainwater Harvesting",
    ],
    images: ["/images/home-20v6.jpeg", "/images/home-20v2.jpeg", "/images/home-20v.jpeg"],
    lat: 21.4628,
    lng: 87.0233,
    has3D: true,
  },
}

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params.id as string
  const property = propertiesData[id] || propertiesData["1"]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [salesPhone, setSalesPhone] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const handleContactSubmit = async () => {
    setIsSubmitting(true)
    const result = await createLead({
      name: "Property Inquiry",
      email: "inquiry@odibrix.com",
      phone: "Not provided",
      lead_type: "contact",
      property_interest: property.title,
      message: `Interested in ${property.title} at ${property.location}`,
    })

    if (result.success) {
      setSalesPhone("9778561010")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-foreground">
              Properties
            </Link>
            <span>/</span>
            <span className="text-foreground">{property.title}</span>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="relative rounded-xl overflow-hidden"
              >
                <div className="aspect-[16/10] relative">
                  <img
                    src={property.images[currentImageIndex] || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? "border-accent" : "border-transparent"
                      }`}
                    >
                      <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Title & Actions */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize">
                      {property.type}
                    </Badge>
                    <Badge className="bg-green-600">{property.status}</Badge>
                  </div>
                  <h1 className="text-3xl font-serif font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" aria-label="Share">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Save">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>

              {/* Tabs - Added 3D Tour tab */}
              <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="3d-tour" className="gap-1">
                      <Box className="w-3 h-3" />
                      3D Tour
                    </TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {property.beds > 0 && (
                        <Card>
                          <CardContent className="p-4 flex items-center gap-3">
                            <BedDouble className="w-5 h-5 text-accent" />
                            <div>
                              <p className="text-sm text-muted-foreground">Bedrooms</p>
                              <p className="font-semibold">{property.beds}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {property.baths > 0 && (
                        <Card>
                          <CardContent className="p-4 flex items-center gap-3">
                            <Bath className="w-5 h-5 text-accent" />
                            <div>
                              <p className="text-sm text-muted-foreground">Bathrooms</p>
                              <p className="font-semibold">{property.baths}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                          <Maximize className="w-5 h-5 text-accent" />
                          <div>
                            <p className="text-sm text-muted-foreground">Area</p>
                            <p className="font-semibold">{property.area.toLocaleString()} sqft</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </TabsContent>
                  <TabsContent value="features" className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="3d-tour" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Interactive 3D Tour</h3>
                          <p className="text-sm text-muted-foreground">
                            Explore this property in 3D - drag to rotate, scroll to zoom
                          </p>
                        </div>
                        <Link href="/3d-viewer">
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Box className="w-4 h-4" />
                            Full Viewer
                          </Button>
                        </Link>
                      </div>
                      <ModelViewer showUpload={false} initialModel="sample" autoRotate={true} />
                      <p className="text-xs text-muted-foreground text-center">
                        This is a sample 3D model. Actual property visualization available on request.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="location" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Address</h3>
                        <p className="text-muted-foreground">{property.address}</p>
                      </div>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Google Maps will be embedded here</p>
                      </div>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <MapPin className="w-4 h-4" />
                        Get Directions
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="text-3xl font-bold text-primary">{property.price}</p>
                    </div>

                    {salesPhone ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-800 mb-2">Your Sales Representative</p>
                        <p className="text-2xl font-bold text-green-700">{salesPhone}</p>
                      </div>
                    ) : (
                      <div className="space-y-3 mb-6">
                        <Button
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                          onClick={handleContactSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                          Contact Agent
                        </Button>
                        <Link href="/book-visit" className="block">
                          <Button variant="outline" className="w-full gap-2 bg-transparent">
                            <Calendar className="w-4 h-4" />
                            Schedule Visit
                          </Button>
                        </Link>
                        {property.has3D && (
                          <Link href="/3d-viewer" className="block">
                            <Button variant="outline" className="w-full gap-2 bg-transparent">
                              <Video className="w-4 h-4" />
                              Virtual Tour
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Need Help Deciding?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get a detailed floor plan and cost estimation from our experts.
                      </p>
                      <Link href="/get-floor-plan">
                        <Button variant="outline" className="w-full bg-transparent">
                          Get Floor Plan (₹1,499)
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
