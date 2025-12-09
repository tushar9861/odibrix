"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { PropertyBadge } from "@/components/ui/property-badge"
import { MapPin, BedDouble, Bath, Maximize, Search, Grid3X3, List, ArrowRight, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import type { Property } from "@/lib/types"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

interface PropertiesClientProps {
  properties: Property[]
}

export function PropertiesClient({ properties }: PropertiesClientProps) {
  const searchParams = useSearchParams()
  const typeFromUrl = searchParams.get("type")

  const [searchTerm, setSearchTerm] = useState("")
  const [propertyType, setPropertyType] = useState(typeFromUrl || "all")
  const [priceRange, setPriceRange] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesType = propertyType === "all" || property.property_type === propertyType
    let matchesPrice = true
    const price = property.price || 0
    if (priceRange === "under-50") matchesPrice = price < 5000000
    else if (priceRange === "50-1cr") matchesPrice = price >= 5000000 && price <= 10000000
    else if (priceRange === "above-1cr") matchesPrice = price > 10000000

    return matchesSearch && matchesType && matchesPrice
  })

  const formatPrice = (price?: number) => {
    if (!price) return "Price on Request"
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakhs`
    return `₹${price.toLocaleString()}`
  }

  // Assign badge types based on property features
  const getBadgeType = (property: Property, index: number): "hot" | "premium" | "verified" | null => {
    if (property.featured) return "premium"
    if (index % 3 === 0) return "hot"
    if (index % 4 === 0) return "verified"
    return null
  }

  return (
    <main className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-12">
          <motion.span
            className="text-accent font-semibold text-sm uppercase tracking-wider mb-3 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Explore Our Collection
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Browse Properties</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your perfect property from our curated listings in Odisha.
          </p>
        </motion.div>

        {/* Filters with animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-card border rounded-2xl p-6 mb-8 shadow-premium"
        >
          <div className="flex flex-col gap-4">
            {/* Search and toggle */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base rounded-xl border-2 focus:border-accent transition-colors"
                />
              </div>
              <AnimatedButton
                variant="outline"
                className="md:hidden bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </AnimatedButton>
            </div>

            {/* Filter controls */}
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className={`flex flex-col md:flex-row gap-4 ${showFilters ? "block" : "hidden md:flex"}`}
              >
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-2">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="farmhouse">Farmhouse</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-2">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-50">Under ₹50 Lakhs</SelectItem>
                    <SelectItem value="50-1cr">₹50L - 1 Crore</SelectItem>
                    <SelectItem value="above-1cr">Above ₹1 Crore</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2 ml-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-accent text-accent-foreground shadow-lg" : "bg-muted hover:bg-muted/80"}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-accent text-accent-foreground shadow-lg" : "bg-muted hover:bg-muted/80"}`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-muted-foreground flex items-center justify-between"
        >
          <span>
            Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
          </span>
          {(searchTerm || propertyType !== "all" || priceRange !== "all") && (
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setPropertyType("all")
                setPriceRange("all")
              }}
            >
              Clear Filters
            </AnimatedButton>
          )}
        </motion.div>

        {/* Properties Grid/List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
        >
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, index) => {
              const badgeType = getBadgeType(property, index)

              return (
                <motion.div
                  key={property.id}
                  layout
                  variants={fadeInUp}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group"
                >
                  <Link href={`/properties/${property.id}`}>
                    <AnimatedCard
                      className={`overflow-hidden border-0 shadow-premium ${viewMode === "list" ? "flex flex-col md:flex-row" : ""}`}
                      delay={index * 0.05}
                    >
                      <div
                        className={`relative overflow-hidden ${viewMode === "list" ? "md:w-80 md:shrink-0 aspect-[4/3] md:aspect-auto md:h-full" : "aspect-[4/3]"}`}
                      >
                        <img
                          src={property.images?.[0] || "/placeholder.svg?height=300&width=400&query=property"}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {badgeType && <PropertyBadge type={badgeType} />}
                        </div>
                        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium capitalize">
                          {property.property_type}
                        </div>
                        {/* Price overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <p className="text-2xl font-bold text-white">{formatPrice(property.price)}</p>
                        </div>
                      </div>
                      <CardContent
                        className={`p-6 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}
                      >
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground mb-4">
                          <MapPin className="w-4 h-4 mr-1 text-accent" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                          {property.bedrooms && property.bedrooms > 0 && (
                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                              <BedDouble className="w-4 h-4" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms && property.bathrooms > 0 && (
                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                              <Bath className="w-4 h-4" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                          {property.area_sqft && (
                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                              <Maximize className="w-4 h-4" />
                              <span>{property.area_sqft.toLocaleString()} sqft</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-end">
                          <AnimatedButton variant="ghost" size="sm" className="group/btn">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProperties.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-xl font-medium mb-2">No properties found</p>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
            <AnimatedButton
              variant="outline"
              className="bg-transparent"
              onClick={() => {
                setSearchTerm("")
                setPropertyType("all")
                setPriceRange("all")
              }}
            >
              Clear All Filters
            </AnimatedButton>
          </motion.div>
        )}
      </div>
    </main>
  )
}
