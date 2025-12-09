"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const galleryItems = [
  {
    id: 1,
    type: "image",
    src: "/images/home-20v.jpeg",
    title: "Luxury Villa Exterior",
    category: "exterior",
  },
  {
    id: 2,
    type: "image",
    src: "/images/home-20v5.jpeg",
    title: "Modern Living Room",
    category: "interior",
  },
  {
    id: 3,
    type: "image",
    src: "/images/home-20v6.jpeg",
    title: "Premium Apartment Complex",
    category: "exterior",
  },
  {
    id: 4,
    type: "image",
    src: "/images/home-20v2.jpeg",
    title: "Beachfront Property",
    category: "exterior",
  },
  {
    id: 5,
    type: "image",
    src: "/images/home-20v1.jpeg",
    title: "Business Meeting",
    category: "lifestyle",
  },
  {
    id: 6,
    type: "3d",
    src: "/3d-model-preview-apartment.jpg",
    title: "3D Apartment Tour",
    category: "3d",
  },
]

const categories = ["all", "exterior", "interior", "lifestyle", "3d"]

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredItems =
    activeCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  const currentIndex = selectedImage !== null ? filteredItems.findIndex((item) => item.id === selectedImage) : -1

  const goToNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1].id)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1].id)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Property Gallery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our stunning collection of properties through high-quality images and 3D tours.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="capitalize"
              >
                {category === "3d" ? "3D Tours" : category}
              </Button>
            ))}
          </motion.div>

          {/* Masonry Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(item.id)}
              >
                <img
                  src={item.src || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-white/70 text-sm capitalize">{item.category}</p>
                  </div>
                  {item.type === "3d" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-accent-foreground ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>

            {currentIndex > 0 && (
              <button
                className="absolute left-4 text-white hover:text-accent transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrev()
                }}
                aria-label="Previous"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}

            {currentIndex < filteredItems.length - 1 && (
              <button
                className="absolute right-4 text-white hover:text-accent transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                aria-label="Next"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            )}

            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={filteredItems[currentIndex]?.src}
              alt={filteredItems[currentIndex]?.title}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
              <p className="font-medium">{filteredItems[currentIndex]?.title}</p>
              <p className="text-white/70 text-sm">
                {currentIndex + 1} / {filteredItems.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
