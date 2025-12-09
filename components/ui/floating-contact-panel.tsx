"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, MessageCircle, Mail, X } from "lucide-react"

export function FloatingContactPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)

  // Check for overlap with important elements
  useEffect(() => {
    const checkOverlap = () => {
      const panel = document.getElementById("floating-contact-panel")
      if (!panel) return

      const panelRect = panel.getBoundingClientRect()

      // Find all buttons, links, and interactive elements
      const interactiveElements = document.querySelectorAll(
        'button:not(#floating-contact-panel button), a:not(#floating-contact-panel a), [role="button"], input, select, textarea',
      )

      let hasOverlap = false
      interactiveElements.forEach((el) => {
        const elRect = el.getBoundingClientRect()
        // Check if elements overlap
        if (
          panelRect.left < elRect.right &&
          panelRect.right > elRect.left &&
          panelRect.top < elRect.bottom &&
          panelRect.bottom > elRect.top
        ) {
          hasOverlap = true
        }
      })

      setIsMinimized(hasOverlap)
    }

    // Check on scroll and resize
    window.addEventListener("scroll", checkOverlap, { passive: true })
    window.addEventListener("resize", checkOverlap, { passive: true })

    // Initial check
    checkOverlap()

    return () => {
      window.removeEventListener("scroll", checkOverlap)
      window.removeEventListener("resize", checkOverlap)
    }
  }, [])

  const contactOptions = [
    {
      icon: Phone,
      label: "Call",
      href: "tel:+918763022010",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/918763022010?text=Hi%20OdiBrix,%20I%20am%20interested%20in%20your%20properties",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:contact@odibrix.com",
      color: "bg-blue-500 hover:bg-blue-600",
    },
  ]

  if (!isVisible) return null

  return (
    <div
      id="floating-contact-panel"
      className={`fixed z-40 transition-all duration-300 ${
        isMinimized ? "bottom-4 right-4" : "bottom-6 right-6 md:bottom-8 md:right-8"
      }`}
    >
      <AnimatePresence>
        {isExpanded && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col gap-2 items-end"
          >
            {contactOptions.map((option, index) => (
              <motion.a
                key={option.label}
                href={option.href}
                target={option.label === "WhatsApp" ? "_blank" : undefined}
                rel={option.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg ${option.color} transition-transform hover:scale-105`}
              >
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`relative flex items-center justify-center rounded-full shadow-xl transition-all ${
          isMinimized ? "w-10 h-10 bg-primary/80" : "w-14 h-14 bg-primary hover:bg-primary/90"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className={`text-white ${isMinimized ? "h-4 w-4" : "h-6 w-6"}`} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className={`text-white ${isMinimized ? "h-4 w-4" : "h-6 w-6"}`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse indicator when minimized */}
        {isMinimized && !isExpanded && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
        )}
      </motion.button>

      {/* Tooltip on hover when minimized */}
      {isMinimized && !isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">Contact Us</div>
        </div>
      )}
    </div>
  )
}
