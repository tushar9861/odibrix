"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, User, Quote } from "lucide-react"
import type { Testimonial } from "@/lib/types"

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

interface TestimonialsClientProps {
  testimonials: Testimonial[]
}

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  return (
    <main className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Client Testimonials</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from our satisfied clients across Odisha. Their trust drives our commitment to excellence.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "350+", label: "Properties Sold" },
            { value: "4.9", label: "Average Rating" },
            { value: "5+", label: "Years Experience" },
          ].map((stat, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.id || index} variants={fadeInUp} whileHover={{ y: -5 }}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="w-10 h-10 text-accent/30 mb-4" />
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 bg-accent/10 p-2 rounded-full">
                        {testimonial.image_url ? (
                          <img
                            src={testimonial.image_url || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-accent" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{testimonial.property_type}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{testimonial.location}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
