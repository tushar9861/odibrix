import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Plus } from "lucide-react"

export default async function TestimonialsAdminPage() {
  const supabase = await createClient()

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage customer reviews</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials && testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <div className="flex gap-2">
                    {testimonial.is_featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                    <Badge variant={testimonial.is_approved ? "default" : "secondary"}>
                      {testimonial.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">"{testimonial.content}"</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Edit
                  </Button>
                  {!testimonial.is_approved && (
                    <Button size="sm" variant="default">
                      Approve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No testimonials found. Run the database scripts to seed data.
              </p>
              <Button variant="outline" className="bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add First Testimonial
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
