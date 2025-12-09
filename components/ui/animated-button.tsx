"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
  glowColor?: string
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, glowColor = "rgba(234, 88, 12, 0.5)", ...props }, ref) => {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="relative">
        <Button
          ref={ref}
          className={cn("relative overflow-hidden btn-shine transition-all duration-300", "hover:shadow-lg", className)}
          style={{
            // @ts-ignore
            "--glow-color": glowColor,
          }}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    )
  },
)
AnimatedButton.displayName = "AnimatedButton"
