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
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Search,
  Grid3X3,
  List,
  ArrowRight,
  SlidersHorizontal,
  Star,
} from "lucide-react"
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
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)

  const filteredProperties = properties
    .filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      const matchesType = propertyType === "all" || property.property_type === propertyType
      let matchesPrice = true
      const price = property.price || 0
      if (priceRange === "under-50") matchesPrice = price < 5000000
      else if (priceRange === "50-1cr") matchesPrice = price >= 5000000 && price <= 10000000
      else if (priceRange === "above-1cr") matchesPrice = price > 10000000

      const matchesVerified = !showVerifiedOnly || property.featured

      return matchesSearch && matchesType && matchesPrice && matchesVerified
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        case "price-low":
          return (a.price || 0) - (b.price || 0)
        case "price-high":
          return (b.price || 0) - (a.price || 0)
        case "views":
          return (b.view_count || 0) - (a.view_count || 0)
        default:
          return 0
      }
    })

  // Separate verified and regular properties
  const verifiedProperties = filteredProperties.filter((p) => p.featured)
  const regularProperties = filteredProperties.filter((p) => !p.featured)
  const allDisplayProperties = [...verifiedProperties, ...regularProperties]

  const formatPrice = (price?: number) => {
    if (!price) return "Price on Request"
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakhs`
    return `₹${price.toLocaleString()}`
  }

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
                  <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl border-2">
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
                  <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl border-2">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-50">Under ₹50 Lakhs</SelectItem>
                    <SelectItem value="50-1cr">₹50L - 1 Crore</SelectItem>
                    <SelectItem value="above-1cr">Above ₹1 Crore</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl border-2">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>

                <AnimatedButton
                  variant={showVerifiedOnly ? "default" : "outline"}
                  className="w-full md:w-auto"
                  onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {showVerifiedOnly ? "Verified Only" : "All Properties"}
                </AnimatedButton>

                <div className="flex gap-2 ml-auto">
                  <AnimatedButton
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </AnimatedButton>
                  <AnimatedButton
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </AnimatedButton>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{allDisplayProperties.length}</span> properties
            </div>
          </div>
        </motion.div>

        {verifiedProperties.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-accent fill-accent" />
                <h2 className="text-2xl font-serif font-bold">OdiBrix Verified Properties</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent" />
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {verifiedProperties.map((property, index) => (
                <motion.div key={property.id} variants={fadeInUp}>
                  <Link href={`/properties/${property.id}`}>
                    <AnimatedCard className="h-full hover:shadow-premium-lg cursor-pointer border-2 border-accent/20 hover:border-accent/50">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {property.images?.[0] && (
                          <img
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        {getBadgeType(property, index) && (
                          <div className="absolute top-4 right-4 z-10">
                            <PropertyBadge type={getBadgeType(property, index)!} />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{property.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {property.location}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <p className="text-2xl font-bold text-accent">{formatPrice(property.price)}</p>

                          <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-b border-muted">
                            {property.bedrooms && property.property_type !== "commercial" && (
                              <div>
                                <BedDouble className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                <p className="text-sm font-medium">{property.bedrooms} BHK</p>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div>
                                <Bath className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                <p className="text-sm font-medium">{property.bathrooms}</p>
                              </div>
                            )}
                            {property.area_sqft && (
                              <div>
                                <Maximize className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                <p className="text-sm font-medium">{(property.area_sqft / 1000).toFixed(1)}k sqft</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-accent font-semibold uppercase">OdiBrix Verified</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Regular Properties */}
        {regularProperties.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            {verifiedProperties.length > 0 && <h2 className="text-2xl font-serif font-bold mb-6">All Properties</h2>}

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {regularProperties.map((property, index) => (
                <motion.div key={property.id} variants={fadeInUp}>
                  <Link href={`/properties/${property.id}`}>
                    <AnimatedCard className="h-full hover:shadow-premium-lg cursor-pointer">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {property.images?.[0] && (
                          <img
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        {getBadgeType(property, index) && (
                          <div className="absolute top-4 right-4 z-10">
                            <PropertyBadge type={getBadgeType(property, index)!} />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{property.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {property.location}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <p className="text-2xl font-bold text-accent">{formatPrice(property.price)}</p>

                          <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-b border-muted">
                            {property.bedrooms && property.property_type !== "commercial" && (
                              <div>
                                <BedDouble className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                <p className="text-sm font-medium">{property.bedrooms} BHK</p>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div>
                                <Bath className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                <p className="text-sm font-medium">{property.bathrooms}</p>
                              </div>
                            )}
                            {property.area_sqft && (
                              <div>
                                <Maximize className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                <p className="text-sm font-medium">{(property.area_sqft / 1000).toFixed(1)}k sqft</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground font-semibold">View Details</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* No results */}
        {allDisplayProperties.length === 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center py-20">
            <p className="text-lg text-muted-foreground">No properties found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </main>
  )
}
