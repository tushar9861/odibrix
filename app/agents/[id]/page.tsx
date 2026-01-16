import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, Award } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface AgentDetailPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase.from("agents").select("*").eq("id", params.id).single()

  return {
    title: `${data?.agency_name || "Agent"} - OdiBrix Real Estate`,
    description: `Contact ${data?.agency_name || "agent"} for real estate services in ${data?.city}, ${data?.region}.`,
  }
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const supabase = await createClient()

  const { data: agent, error } = await supabase.from("agents").select("*").eq("id", params.id).single()

  if (error || !agent) {
    notFound()
  }

  const { data: properties } = await supabase.from("properties").select("*").eq("agent_id", agent.id).limit(6)

  const { data: reviews } = await supabase
    .from("agent_reviews")
    .select("*")
    .eq("agent_id", agent.id)
    .eq("is_approved", true)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Agent Header */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">{agent.agency_name}</h1>
                    <p className="text-lg text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {agent.city}, {agent.region}
                    </p>
                  </div>
                  {agent.is_best_agent && (
                    <Badge className="bg-amber-500 text-lg gap-2 py-2 px-4">
                      <Award className="h-4 w-4" />
                      Best Agent
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(agent.rating || 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <span className="font-semibold text-lg">{(agent.rating || 0).toFixed(1)}</span>
                    <span className="text-muted-foreground ml-2">({agent.review_count || 0} reviews)</span>
                  </div>
                </div>

                {/* Bio */}
                {agent.bio && <p className="text-muted-foreground">{agent.bio}</p>}
              </div>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-accent" />
                    <a href={`tel:${agent.phone}`} className="font-medium hover:text-accent">
                      {agent.phone}
                    </a>
                  </div>
                  {agent.alternate_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-accent" />
                      <a href={`tel:${agent.alternate_phone}`} className="font-medium hover:text-accent">
                        {agent.alternate_phone}
                      </a>
                    </div>
                  )}
                  <Button className="w-full gap-2 bg-accent hover:bg-accent/90">
                    <Phone className="h-4 w-4" />
                    Call Agent
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Active Listings</p>
                <p className="text-3xl font-bold">{agent.total_listings || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Sales</p>
                <p className="text-3xl font-bold">₹{((agent.total_sales || 0) / 10000000).toFixed(1)}Cr</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Commission Rate</p>
                <p className="text-3xl font-bold">{agent.commission_rate}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Brix Points</p>
                <p className="text-3xl font-bold text-amber-600">{agent.brix_points}</p>
              </CardContent>
            </Card>
          </div>

          {/* Properties Section */}
          {properties && properties.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold mb-6">Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id}>
                    <div className="aspect-video bg-muted overflow-hidden">
                      {property.images?.[0] && (
                        <img
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{property.title}</h3>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                      <p className="text-lg font-bold text-accent mt-2">₹{(property.price || 0) / 100000}L</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {reviews && reviews.length > 0 && (
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{review.customer_name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.review}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
