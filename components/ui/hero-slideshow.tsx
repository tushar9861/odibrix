"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeroSlideshowProps {
  images: string[]
  interval?: number
  children?: React.ReactNode
}

export function HeroSlideshow({ images, interval = 6000, children }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center animate-hero-zoom"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: typeof window !== "undefined" ? window.innerHeight + 10 : 800,
            }}
            animate={{
              y: -10,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">{children}</div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex ? "w-8 bg-accent" : "bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </div>
  )
}
