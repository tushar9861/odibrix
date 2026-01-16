"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, LogOut, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const [user, setUser] = React.useState<User | null>(null)
  const [userRole, setUserRole] = React.useState<"customer" | "agent" | "owner" | null>(null)
  const router = useRouter()

  React.useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user || null)

      if (user) {
        // Determine user role
        const accountType = user.user_metadata?.account_type
        if (accountType === "agent") {
          setUserRole("agent")
        } else if (accountType === "owner") {
          setUserRole("owner")
        } else {
          setUserRole("customer")
        }
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)

      if (currentUser) {
        const accountType = currentUser.user_metadata?.account_type
        if (accountType === "agent") {
          setUserRole("agent")
        } else if (accountType === "owner") {
          setUserRole("owner")
        } else {
          setUserRole("customer")
        }
      } else {
        setUserRole(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

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

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
    router.push("/")
  }

  const getDashboardLink = () => {
    if (userRole === "agent") return "/agent/dashboard"
    if (userRole === "owner") return "/owner/dashboard"
    return "/customer/profile"
  }

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
            {!user ? (
              <>
                <Link href="/auth/login" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                  <span>Customer Login</span>
                </Link>
                <span className="opacity-50">|</span>
                <Link href="/auth/login" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                  <span>Agent Login</span>
                </Link>
                <span className="opacity-50">|</span>
                <Link href="/auth/login" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                  <span>Owner Login</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <span>
                    {userRole === "agent" ? "Agent Dashboard" : userRole === "owner" ? "Owner Portal" : "My Profile"}
                  </span>
                </Link>
                <span className="opacity-50">|</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <span>Sign Out</span>
                </button>
              </>
            )}
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

            {/* Auth Buttons - Desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 ml-4 pl-4 border-l border-muted"
            >
              {!user ? (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <span className="capitalize">
                        {userRole === "agent" ? "Agent" : userRole === "owner" ? "Owner" : "Customer"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="cursor-pointer flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        {userRole === "agent" ? "Dashboard" : userRole === "owner" ? "My Portal" : "Profile"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t bg-background"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t space-y-2">
                {!user ? (
                  <>
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-accent hover:bg-accent/90">Sign Up</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        {userRole === "agent" ? "Dashboard" : userRole === "owner" ? "My Portal" : "Profile"}
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        handleSignOut()
                        setIsOpen(false)
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
