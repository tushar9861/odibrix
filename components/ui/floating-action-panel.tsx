"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Phone, Mail, X, ChevronUp, Search, Heart, Headphones, PhoneCall } from "lucide-react"
import { cn } from "@/lib/utils"

export function FloatingActionPanel() {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [showQuickMenu, setShowQuickMenu] = React.useState(false)

  const mainActions = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/918763022010?text=Hi%20OdiBrix%2C%20I%27m%20interested%20in%20your%20properties",
      color: "bg-green-500 hover:bg-green-600",
      delay: 0.1,
    },
    {
      icon: Phone,
      label: "Call",
      href: "tel:+918763022010",
      color: "bg-blue-500 hover:bg-blue-600",
      delay: 0.2,
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:contact@odibrix.com?subject=Property%20Inquiry",
      color: "bg-accent hover:bg-accent/90",
      delay: 0.3,
    },
  ]

  const quickActions = [
    { icon: Search, label: "Search Properties", href: "/properties" },
    { icon: Heart, label: "Saved Properties", href: "/properties?saved=true" },
    { icon: Headphones, label: "Agent Help", href: "/consult" },
    { icon: PhoneCall, label: "Request Callback", href: "/book-visit" },
  ]

  return (
    <>
      {/* Bottom Floating Action Panel */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
      >
        <div className="max-w-lg mx-auto pointer-events-auto">
          <motion.div className={cn("rounded-2xl p-3 glass-dark shadow-premium-lg", "border border-white/10")}>
            <div className="flex items-center justify-center gap-3">
              {mainActions.map((action, index) => (
                <motion.a
                  key={action.label}
                  href={action.href}
                  target={action.label === "WhatsApp" ? "_blank" : undefined}
                  rel={action.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 1.2 + action.delay, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "relative flex items-center justify-center w-14 h-14 rounded-full text-white",
                    "shadow-lg transition-shadow",
                    action.color,
                  )}
                >
                  <action.icon className="w-6 h-6" />
                  {/* Ripple effect */}
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"
                    style={{ animationDuration: "2s" }}
                  />
                </motion.a>
              ))}

              {/* Expand button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-full",
                  "bg-primary text-primary-foreground shadow-lg",
                  "transition-transform duration-300",
                  isExpanded && "rotate-180",
                )}
              >
                <ChevronUp className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Expanded panel with more info */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-3 border-t border-white/10">
                    <p className="text-center text-white/80 text-sm mb-3">Need help? We're here 24/7</p>
                    <div className="flex items-center justify-center gap-2 text-white/90">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">8763022010</span>
                      <span className="text-white/50 mx-2">|</span>
                      <span className="text-sm">Mon-Sat, 9AM-6PM</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Side Floating Quick Action Menu */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={() => setShowQuickMenu(!showQuickMenu)}
          className={cn(
            "w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-premium-lg",
            "flex items-center justify-center transition-all duration-300",
            "hover:scale-110",
            showQuickMenu && "rotate-45",
          )}
        >
          {showQuickMenu ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </motion.button>

        <AnimatePresence>
          {showQuickMenu && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-14 top-1/2 -translate-y-1/2"
            >
              <div className="bg-card rounded-xl shadow-premium-lg p-2 min-w-[180px]">
                {quickActions.map((action, index) => (
                  <motion.a
                    key={action.label}
                    href={action.href}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg",
                      "text-sm font-medium text-foreground",
                      "hover:bg-accent/10 transition-colors",
                    )}
                  >
                    <action.icon className="w-4 h-4 text-accent" />
                    {action.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
