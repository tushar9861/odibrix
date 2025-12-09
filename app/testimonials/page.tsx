import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { getTestimonials } from "@/lib/actions/testimonials"
import { TestimonialsClient } from "@/components/testimonials/testimonials-client"
import type { Metadata } from "next"

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

export const metadata: Metadata = {
  title: "Client Testimonials - What Our Customers Say",
  description:
    "Read testimonials from satisfied OdiBrix customers. Real experiences from homeowners and investors across Odisha who found their dream properties with us.",
  openGraph: {
    title: "Client Testimonials | OdiBrix",
    description: "Real experiences from satisfied OdiBrix customers across Odisha.",
  },
}

export default async function TestimonialsPage() {
  const result = await getTestimonials()
  const dbTestimonials = result.success ? result.data : []

  const fallbackTestimonials = [
    {
      id: "1",
      name: "Rajesh Mohanty",
      location: "Baleshwar",
      rating: 5,
      content:
        "OdiBrix helped us find our dream home in Baleshwar. Their expertise in local properties and transparent pricing made the entire process stress-free. The team was always available to answer our questions.",
      property_type: "villa",
      is_featured: true,
    },
    {
      id: "2",
      name: "Priya Sahoo",
      location: "Bhubaneswar",
      rating: 5,
      content:
        "The floor plan consultancy was worth every rupee. They provided detailed estimations and helped me make an informed investment decision. I've now purchased 3 properties through OdiBrix.",
      property_type: "apartment",
      is_featured: true,
    },
    {
      id: "3",
      name: "Amit Panda",
      location: "Cuttack",
      rating: 5,
      content:
        "The virtual tour feature saved me so much time. I could explore properties from anywhere before scheduling physical visits. The 3D walkthroughs are incredibly detailed.",
      property_type: "apartment",
      is_featured: true,
    },
    {
      id: "4",
      name: "Sunita Das",
      location: "Baleshwar",
      rating: 5,
      content:
        "Found the perfect commercial space for my business through OdiBrix. The team understood my requirements perfectly and showed me exactly what I needed. Highly professional service.",
      property_type: "commercial",
      is_featured: false,
    },
    {
      id: "5",
      name: "Bikash Nayak",
      location: "Dubai (investing in Odisha)",
      rating: 5,
      content:
        "Being overseas, the virtual tours were a game-changer. OdiBrix handled everything professionally, from property selection to documentation. Excellent communication throughout.",
      property_type: "villa",
      is_featured: true,
    },
    {
      id: "6",
      name: "Mamata Behera",
      location: "Chandipur",
      rating: 5,
      content:
        "We wanted a beachside property and OdiBrix delivered beyond our expectations. The property they recommended has become our family's favorite getaway spot.",
      property_type: "farmhouse",
      is_featured: false,
    },
  ]

  const testimonials = dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials

  return (
    <div className="min-h-screen">
      <Navbar />
      <TestimonialsClient testimonials={testimonials} />
      <Footer />
    </div>
  )
}
