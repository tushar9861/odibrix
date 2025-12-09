import { Suspense } from "react"
import { getProperties } from "@/lib/actions/properties"
import { PropertiesClient } from "@/components/properties/properties-client"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import type { Metadata } from "next"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const fallbackProperties = [
  {
    id: "1",
    title: "Modern 3BHK Apartment",
    location: "Baleshwar Town, Odisha",
    price: 4500000,
    property_type: "apartment" as const,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1450,
    images: ["/images/home-20v5.jpeg"],
    featured: true,
    status: "available" as const,
  },
  {
    id: "2",
    title: "Premium Villa with Garden",
    location: "Chandipur, Odisha",
    price: 12000000,
    property_type: "villa" as const,
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 2800,
    images: ["/images/home-20v6.jpeg"],
    featured: true,
    status: "available" as const,
  },
  {
    id: "3",
    title: "Commercial Space - Main Road",
    location: "Station Road, Baleshwar",
    price: 8500000,
    property_type: "commercial" as const,
    bedrooms: 0,
    bathrooms: 2,
    area_sqft: 2200,
    images: ["/images/home-20v2.jpeg"],
    featured: false,
    status: "available" as const,
  },
  {
    id: "4",
    title: "Residential Plot - NH16",
    location: "Near NH16, Baleshwar",
    price: 3200000,
    property_type: "plot" as const,
    bedrooms: 0,
    bathrooms: 0,
    area_sqft: 4000,
    images: ["/images/home-20v.jpeg"],
    featured: false,
    status: "available" as const,
  },
  {
    id: "5",
    title: "Beachfront Villa",
    location: "Chandipur Beach Road",
    price: 25000000,
    property_type: "villa" as const,
    bedrooms: 5,
    bathrooms: 4,
    area_sqft: 4500,
    images: ["/images/home-20v6.jpeg"],
    featured: true,
    status: "available" as const,
  },
]

export const metadata: Metadata = {
  title: "Browse Properties - Apartments, Villas, Commercial & Land",
  description:
    "Browse premium properties in Odisha. Find apartments, villas, commercial spaces, and land for sale in Baleshwar, Bhubaneswar, and surrounding areas.",
  openGraph: {
    title: "Browse Properties | OdiBrix Real Estate",
    description: "Find apartments, villas, commercial spaces, and land for sale in Odisha.",
  },
}

export default async function PropertiesPage() {
  const result = await getProperties()
  const dbProperties = result.success ? result.data : []

  const properties = dbProperties && dbProperties.length > 0 ? dbProperties : fallbackProperties

  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<div className="pt-32 pb-20 text-center">Loading properties...</div>}>
        <PropertiesClient properties={properties} />
      </Suspense>
      <Footer />
    </div>
  )
}
