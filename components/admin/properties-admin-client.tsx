"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  IndianRupee,
  ImageIcon,
  Building2,
  Eye,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { MultiImageUpload } from "@/components/ui/multi-image-upload"

interface Property {
  id: string
  title: string
  description: string
  property_type: string
  location: string
  address: string
  price: number
  area_sqft: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  images: string[]
  status: string
  featured: boolean
  category_id: string
  approval_status: string
  view_count: number
  lead_count: number
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface PropertiesAdminClientProps {
  initialProperties: Property[]
  categories: Category[]
}

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "home", label: "Single Home" },
  { value: "villa", label: "Villa" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land/Plot" },
  { value: "office", label: "Office Space" },
]

const AMENITIES = [
  "Parking",
  "Swimming Pool",
  "Gym",
  "Garden",
  "Security",
  "Power Backup",
  "Lift",
  "Club House",
  "Children Play Area",
  "24/7 Water Supply",
  "CCTV",
  "Intercom",
  "Fire Safety",
  "Visitor Parking",
  "Servant Room",
  "Modular Kitchen",
  "Air Conditioning",
  "Balcony",
  "Terrace",
  "Store Room",
]

export function PropertiesAdminClient({ initialProperties, categories }: PropertiesAdminClientProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "",
    location: "",
    address: "",
    price: "",
    area_sqft: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [] as string[],
    images: [] as string[],
    status: "available",
    featured: false,
    category_id: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      property_type: "",
      location: "",
      address: "",
      price: "",
      area_sqft: "",
      bedrooms: "",
      bathrooms: "",
      amenities: [],
      images: [],
      status: "available",
      featured: false,
      category_id: "",
    })
    setEditingProperty(null)
    setError(null)
  }

  const openEditDialog = (property: Property) => {
    setEditingProperty(property)
    setFormData({
      title: property.title || "",
      description: property.description || "",
      property_type: property.property_type || "",
      location: property.location || "",
      address: property.address || "",
      price: property.price?.toString() || "",
      area_sqft: property.area_sqft?.toString() || "",
      bedrooms: property.bedrooms?.toString() || "",
      bathrooms: property.bathrooms?.toString() || "",
      amenities: property.amenities || [],
      images: property.images || [],
      status: property.status || "available",
      featured: property.featured || false,
      category_id: property.category_id || "",
    })
    setError(null)
    setIsDialogOpen(true)
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    const propertyData = {
      title: formData.title,
      description: formData.description,
      property_type: formData.property_type,
      location: formData.location,
      address: formData.address,
      price: Number.parseFloat(formData.price) || 0,
      area_sqft: Number.parseInt(formData.area_sqft) || 0,
      bedrooms: Number.parseInt(formData.bedrooms) || 0,
      bathrooms: Number.parseInt(formData.bathrooms) || 0,
      amenities: formData.amenities,
      images: formData.images,
      status: formData.status,
      featured: formData.featured,
      category_id: formData.category_id || null,
      approval_status: "approved",
    }

    try {
      if (editingProperty) {
        const { error: updateError } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", editingProperty.id)

        if (updateError) {
          console.error("Update error:", updateError)
          throw new Error(updateError.message || "Failed to update property")
        }

        setProperties(properties.map((p) => (p.id === editingProperty.id ? { ...p, ...propertyData } : p)))
      } else {
        const { data, error: insertError } = await supabase.from("properties").insert([propertyData]).select().single()

        if (insertError) {
          console.error("Insert error:", insertError)
          throw new Error(insertError.message || "Failed to create property")
        }

        setProperties([data, ...properties])
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      console.error("Error saving property:", err)
      setError(err instanceof Error ? err.message : "Error saving property. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return

    const supabase = createClient()

    try {
      const { error: deleteError } = await supabase.from("properties").delete().eq("id", id)
      if (deleteError) throw deleteError
      setProperties(properties.filter((p) => p.id !== id))
      router.refresh()
    } catch (err) {
      console.error("Error deleting property:", err)
      alert("Error deleting property")
    }
  }

  // Filter and search properties
  const filteredProperties = properties.filter((property) => {
    const matchesFilter = filter === "all" || property.status === filter || property.property_type === filter
    const matchesSearch =
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`
    return `₹${price.toLocaleString("en-IN")}`
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage property listings ({properties.length} total)</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" size="lg">
              <Plus className="h-5 w-5" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{editingProperty ? "Edit Property" : "Add New Property"}</DialogTitle>
              <DialogDescription>
                {editingProperty ? "Update property details" : "Fill in the property information below"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Modern 3BHK Apartment with Sea View"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="property_type">Property Type *</Label>
                      <Select
                        value={formData.property_type}
                        onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category_id">Category</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Category</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed description of the property"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Baleshwar, Odisha"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g., 4500000"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Complete address with landmarks"
                      rows={2}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area_sqft">Area (sq.ft)</Label>
                      <Input
                        id="area_sqft"
                        type="number"
                        value={formData.area_sqft}
                        onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                        placeholder="e.g., 1200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        placeholder="e.g., 3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        placeholder="e.g., 2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <Label htmlFor="featured">Featured Property</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Select Amenities</Label>
                    <p className="text-sm text-muted-foreground">Choose all amenities available with this property</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AMENITIES.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-3 rounded-lg border text-left text-sm transition-all ${
                          formData.amenities.includes(amenity)
                            ? "border-accent bg-accent/10 text-accent-foreground"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">{formData.amenities.length} amenities selected</p>
                </TabsContent>

                <TabsContent value="images" className="space-y-4 mt-4">
                  <MultiImageUpload
                    label="Property Images"
                    values={formData.images}
                    onChange={(urls) => setFormData({ ...formData, images: urls })}
                    maxImages={10}
                  />
                  <p className="text-sm text-muted-foreground">
                    First image will be used as the main/cover image. You can upload up to 10 images.
                  </p>
                </TabsContent>
              </Tabs>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mt-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                  className="bg-transparent"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingProperty ? (
                    "Update Property"
                  ) : (
                    "Add Property"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="apartment">Apartments</SelectItem>
            <SelectItem value="home">Homes</SelectItem>
            <SelectItem value="villa">Villas</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden group">
              <div className="aspect-video relative bg-muted">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  <Badge
                    className={
                      property.status === "available"
                        ? "bg-green-100 text-green-800"
                        : property.status === "sold"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {property.status}
                  </Badge>
                  {property.featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                </div>
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Eye className="h-3 w-3" />
                    {property.view_count || 0}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {property.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  {property.bedrooms > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {property.bedrooms}
                    </span>
                  )}
                  {property.bathrooms > 0 && (
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {property.bathrooms}
                    </span>
                  )}
                  {property.area_sqft > 0 && (
                    <span className="flex items-center gap-1">
                      <Square className="h-3 w-3" />
                      {property.area_sqft} sqft
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-accent flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {formatPrice(property.price)}
                  </span>
                  <Badge variant="outline" className="capitalize">
                    {property.property_type}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => openEditDialog(property)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(property.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery || filter !== "all"
                  ? "No properties match your search/filter"
                  : "No properties yet. Add your first property!"}
              </p>
              {!searchQuery && filter === "all" && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Property
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
