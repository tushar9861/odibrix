"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  delay?: number
  hover3D?: boolean
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, delay = 0, hover3D = true, ...props }, ref) => {
    const [rotateX, setRotateX] = React.useState(0)
    const [rotateY, setRotateY] = React.useState(0)
    const cardRef = React.useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hover3D || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      setRotateX(-mouseY / 20)
      setRotateY(mouseX / 20)
    }

    const handleMouseLeave = () => {
      setRotateX(0)
      setRotateY(0)
    }

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
        className="transition-transform duration-200 ease-out"
      >
        <Card
          ref={ref}
          className={cn("overflow-hidden transition-shadow duration-300", "hover:shadow-premium-lg", className)}
          {...props}
        >
          {children}
        </Card>
      </motion.div>
    )
  },
)
AnimatedCard.displayName = "AnimatedCard"
