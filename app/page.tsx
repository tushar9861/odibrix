"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CardContent } from "@/components/ui/card"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { HeroSlideshow } from "@/components/ui/hero-slideshow"
import { PropertyBadge } from "@/components/ui/property-badge"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import {
  Home,
  Building2,
  Building,
  Warehouse,
  MapPin,
  ArrowRight,
  Star,
  User,
  FileText,
  Video,
  Phone,
  Box,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const heroImages = [
  "/images/hero-mansion.jpg",
  "/images/home-20v.jpeg",
  "/images/home-20v5.jpeg",
  "/images/home-20v6.jpeg",
]

const propertyTypes = [
  { icon: Building2, title: "Apartments", count: 45, href: "/properties?type=apartment" },
  { icon: Home, title: "Single Homes", count: 32, href: "/properties?type=home" },
  { icon: Building, title: "Commercial", count: 18, href: "/properties?type=commercial" },
  { icon: Warehouse, title: "Land", count: 25, href: "/properties?type=land" },
]

const featuredProperties = [
  {
    id: "1",
    image: "/images/home-20v5.jpeg",
    title: "Modern 3BHK Apartment",
    location: "Baleshwar Town, Odisha",
    price: "₹45,00,000",
    type: "apartment",
    badge: "hot" as const,
  },
  {
    id: "2",
    image: "/images/home-20v6.jpeg",
    title: "Premium Villa with Garden",
    location: "Chandipur, Odisha",
    price: "₹1,20,00,000",
    type: "home",
    badge: "premium" as const,
  },
  {
    id: "3",
    image: "/images/home-20v2.jpeg",
    title: "Commercial Space - Main Road",
    location: "Station Road, Baleshwar",
    price: "₹85,00,000",
    type: "commercial",
    badge: "verified" as const,
  },
]

const testimonials = [
  {
    name: "Rajesh Mohanty",
    role: "Homeowner",
    quote:
      "OdiBrix helped us find our dream home in Baleshwar. Their expertise in local properties and transparent pricing made the entire process stress-free.",
    stars: 5,
  },
  {
    name: "Priya Sahoo",
    role: "Property Investor",
    quote:
      "The floor plan consultancy was worth every rupee. They provided detailed estimations and helped me make an informed investment decision.",
    stars: 5,
  },
  {
    name: "Amit Panda",
    role: "First-time Buyer",
    quote:
      "The virtual tour feature saved me so much time. I could explore properties from anywhere before scheduling physical visits.",
    stars: 5,
  },
]

export default function HomePage() {
  const [categoriesRef, categoriesInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [propertiesRef, propertiesInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [servicesRef, servicesInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSlideshow images={heroImages}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="container mx-auto px-4 text-center text-white pt-20"
        >
          {/* Animated Logo */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          >
            <div className="relative inline-block">
              <Image
                src="/images/odibrix-logo.jpg"
                alt="OdiBrix"
                width={200}
                height={200}
                className="h-32 w-32 md:h-40 md:w-40 mx-auto rounded-full object-cover shadow-2xl border-4 border-accent animate-float"
                priority
              />
              {/* Glowing ring */}
              <div className="absolute inset-0 rounded-full border-4 border-accent/50 animate-pulse-glow" />
            </div>
          </motion.div>

          {/* Hero Title with golden highlight */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Find Your <span className="text-gold-gradient">Perfect Property</span> in Odisha
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Premium apartments, homes, commercial spaces, and land in Baleshwar and surrounding areas. Expert
            consultancy with transparent pricing.
          </motion.p>

          {/* CTA Buttons with animations */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="/properties">
              <AnimatedButton size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                Explore Listings
                <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </Link>
            <Link href="/book-visit">
              <AnimatedButton
                size="lg"
                variant="outline"
                className="text-base px-8 border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                Book a Visit
              </AnimatedButton>
            </Link>
          </motion.div>

          {/* Floating icons decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-10 text-white/20"
              animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Home className="w-12 h-12" />
            </motion.div>
            <motion.div
              className="absolute top-1/3 right-20 text-white/20"
              animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            >
              <Building2 className="w-16 h-16" />
            </motion.div>
            <motion.div
              className="absolute bottom-1/3 left-20 text-white/20"
              animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
            >
              <MapPin className="w-10 h-10" />
            </motion.div>
          </div>
        </motion.div>
      </HeroSlideshow>

      {/* Property Categories with staggered reveal */}
      <motion.section
        ref={categoriesRef}
        initial="hidden"
        animate={categoriesInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-24 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-3 block">
              Property Categories
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Browse by Property Type</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore our curated selection of properties across different categories
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((category, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Link href={category.href}>
                  <AnimatedCard className="cursor-pointer group border-2 hover:border-accent transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 5 }}
                      >
                        <category.icon className="w-10 h-10 text-accent" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                      <p className="text-muted-foreground">{category.count} Properties</p>
                    </CardContent>
                  </AnimatedCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Properties with 3D cards */}
      <motion.section
        ref={propertiesRef}
        initial="hidden"
        animate={propertiesInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-24 bg-gradient-to-b from-muted/50 to-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
          >
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-3 block">
                Featured Listings
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Featured Properties</h2>
              <p className="text-muted-foreground max-w-xl text-lg">Hand-picked premium listings in prime locations</p>
            </div>
            <Link href="/properties">
              <AnimatedButton variant="outline" className="group bg-transparent">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </AnimatedButton>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div key={property.id} variants={fadeInUp}>
                <Link href={`/properties/${property.id}`}>
                  <AnimatedCard className="overflow-hidden border-0 shadow-premium group" delay={index * 0.1}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <PropertyBadge type={property.badge} />
                      </div>
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      {/* Price overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-2xl font-bold text-white">{property.price}</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1 text-accent" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        ref={servicesRef}
        initial="hidden"
        animate={servicesInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-24 relative"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-3 block">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Video,
                title: "Virtual Tours",
                desc: "Explore properties from anywhere with immersive walkthroughs.",
                href: "/book-visit",
                cta: "Book Virtual Visit",
                variant: "outline" as const,
              },
              {
                icon: Box,
                title: "3D Visualization",
                desc: "Interactive 3D viewer. Upload your SKP designs to visualize.",
                href: "/3d-viewer",
                cta: "Try 3D Viewer",
                variant: "default" as const,
              },
              {
                icon: FileText,
                title: "Floor Plan & Estimation",
                desc: "Get detailed floor plans and cost estimations.",
                href: "/get-floor-plan",
                cta: "Get Floor Plan",
                variant: "default" as const,
              },
              {
                icon: Phone,
                title: "Expert Consultancy",
                desc: "One-on-one consultation for personalized guidance.",
                href: "/consult",
                cta: "Learn More",
                variant: "outline" as const,
              },
            ].map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <AnimatedCard
                  className="h-full border-2 hover:border-accent transition-all duration-300"
                  delay={index * 0.1}
                >
                  <CardContent className="p-8 text-center flex flex-col h-full">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <service.icon className="w-8 h-8 text-accent" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 flex-grow">{service.desc}</p>
                    <Link href={service.href}>
                      <AnimatedButton
                        variant={service.variant}
                        size="sm"
                        className={`w-full ${service.variant === "default" ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "bg-transparent"}`}
                      >
                        {service.cta}
                      </AnimatedButton>
                    </Link>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials with glassmorphism */}
      <motion.section
        ref={testimonialsRef}
        initial="hidden"
        animate={testimonialsInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-24 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden"
      >
        {/* Background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-3 block">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Real experiences from satisfied property buyers
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <AnimatedCard className="h-full glass border-white/10" delay={index * 0.15}>
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-foreground/80 mb-6 italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="mr-4 bg-gradient-to-br from-accent to-accent/50 p-3 rounded-full">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <Link href="/testimonials">
              <AnimatedButton variant="outline" className="group bg-transparent">
                Read More Reviews
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section with gradient animation */}
      <motion.section
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden"
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 animate-gradient-shift" />

        <div className="container mx-auto px-4 relative">
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center">
            <motion.div
              className="inline-block mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Sparkles className="w-12 h-12 text-accent" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-balance">
              Get Your Floor Plan & Expert Estimation
            </h2>
            <p className="text-xl mb-10 text-primary-foreground/80">
              Book our ₹1,499 Expert Consultancy and receive a complimentary basic floor plan and a personalised
              estimation — delivered within 3 business days. No hidden charges.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-floor-plan">
                <AnimatedButton
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </AnimatedButton>
              </Link>
              <Link href="/consult">
                <AnimatedButton
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Learn About Consultancy
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}
