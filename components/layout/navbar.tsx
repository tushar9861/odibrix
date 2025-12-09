"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, User, Home, Briefcase } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/book-visit", label: "Book a Visit" },
  { href: "/gallery", label: "Gallery" },
  { href: "/3d-viewer", label: "3D Viewer" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/consult", label: "Consult" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [lastScrollY, setLastScrollY] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-premium" : "bg-transparent",
      )}
    >
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isScrolled ? 0 : "auto",
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "hidden md:block border-b overflow-hidden",
          "border-transparent bg-primary text-primary-foreground",
        )}
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gold-gradient font-medium"
          >
            Premium Real Estate in Odisha
          </motion.span>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Customer Login</span>
            </Link>
            <span className="opacity-50">|</span>
            <Link href="/auth/login" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Agent Login</span>
            </Link>
            <span className="opacity-50">|</span>
            <motion.a
              href="tel:8763022010"
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="font-semibold">8763022010</span>
            </motion.a>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "h-16" : "h-20 md:h-24",
          )}
        >
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/images/odibrix-logo.jpg"
                alt="OdiBrix - Premium Real Estate"
                width={120}
                height={120}
                className={cn(
                  "rounded-full object-cover shadow-lg border-2 border-accent transition-all duration-300",
                  isScrolled ? "h-12 w-12" : "h-16 w-16 md:h-20 md:w-20",
                )}
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors",
                    "hover:text-accent group",
                    isScrolled ? "text-foreground" : "text-foreground",
                  )}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-3/4" />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/get-floor-plan">
                <Button className="ml-4 bg-accent hover:bg-accent/90 text-accent-foreground btn-shine relative overflow-hidden">
                  Get Free Floor Plan
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <motion.a
              href="tel:8763022010"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Phone className="h-5 w-5 text-accent" />
            </motion.a>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg border-b shadow-premium-lg overflow-hidden"
            >
              <div className="flex flex-col space-y-1 px-4 py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-base font-medium hover:text-accent transition-colors py-3 border-b border-border/50"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-3 space-y-2"
                >
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors py-2"
                  >
                    <Home className="h-4 w-4" />
                    Customer Login
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors py-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    Agent Login
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2"
                  >
                    <User className="h-4 w-4" />
                    Create Account
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Link href="/get-floor-plan" onClick={() => setIsOpen(false)}>
                    <Button className="w-full mt-3 bg-accent hover:bg-accent/90 text-accent-foreground">
                      Get Free Floor Plan
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
