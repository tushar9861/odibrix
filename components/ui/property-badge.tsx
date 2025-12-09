"use client"

import { cn } from "@/lib/utils"
import { Flame, Award, CheckCircle } from "lucide-react"

type BadgeType = "hot" | "premium" | "verified"

interface PropertyBadgeProps {
  type: BadgeType
  className?: string
}

const badgeConfig = {
  hot: {
    icon: Flame,
    label: "Hot Property",
    className: "bg-red-500 text-white",
  },
  premium: {
    icon: Award,
    label: "Premium Listing",
    className: "bg-gradient-to-r from-amber-500 to-yellow-400 text-black",
  },
  verified: {
    icon: CheckCircle,
    label: "Verified Agent",
    className: "bg-emerald-500 text-white",
  },
}

export function PropertyBadge({ type, className }: PropertyBadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
        "animate-badge-pulse",
        config.className,
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  )
}
