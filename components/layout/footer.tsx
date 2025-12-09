"use client"

import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Input } from "@/components/ui/input"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

      <div className="container px-6 py-16 mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand Section */}
          <motion.div variants={fadeInUp}>
            <motion.div className="flex items-center mb-6" whileHover={{ scale: 1.05 }}>
              <Image
                src="/images/odibrix-logo.jpg"
                alt="OdiBrix - Premium Real Estate"
                width={100}
                height={100}
                className="h-20 w-20 rounded-full object-cover border-2 border-accent shadow-lg"
              />
            </motion.div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-6">
              Premium real estate services in Odisha. Find your dream property with expert guidance and transparent
              pricing.
            </p>
            {/* Newsletter signup */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                />
                <AnimatedButton size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </AnimatedButton>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-semibold mb-6 text-gold-gradient">Quick Links</h3>
            <div className="flex flex-col space-y-3 text-sm">
              {[
                { href: "/properties", label: "Properties" },
                { href: "/book-visit", label: "Book a Visit" },
                { href: "/gallery", label: "Gallery" },
                { href: "/3d-viewer", label: "3D Viewer" },
                { href: "/consult", label: "Consultancy" },
                { href: "/get-floor-plan", label: "Get Floor Plan" },
              ].map((link) => (
                <motion.div key={link.href} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link href={link.href} className="hover:text-accent transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-semibold mb-6 text-gold-gradient">Contact Info</h3>
            <div className="flex flex-col space-y-4 text-sm">
              <motion.div className="flex items-start gap-3" whileHover={{ x: 5 }}>
                <div className="p-2 rounded-full bg-accent/20">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <span className="pt-1">Baleshwar, Odisha, India</span>
              </motion.div>
              <motion.a
                href="tel:8763022010"
                className="flex items-center gap-3 hover:text-accent transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="p-2 rounded-full bg-accent/20">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <span>8763022010</span>
              </motion.a>
              <motion.a
                href="mailto:odibrix@gmail.com"
                className="flex items-center gap-3 hover:text-accent transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="p-2 rounded-full bg-accent/20">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <span>odibrix@gmail.com</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-semibold mb-6 text-gold-gradient">Follow Us</h3>
            <div className="flex space-x-3 mb-6">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="p-3 rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition-all"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm font-medium mb-2">Business Hours</p>
              <p className="text-xs text-primary-foreground/70">Mon - Sat: 9:00 AM - 6:00 PM</p>
              <p className="text-xs text-primary-foreground/70">Sunday: By Appointment</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.hr
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-8 border-primary-foreground/20 origin-left"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <p className="text-sm text-primary-foreground/70 flex items-center gap-1">
            © {new Date().getFullYear()} OdiBrix. Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in
            Odisha
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
