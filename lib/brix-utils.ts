/**
 * Brix Points Discount System
 *
 * Rules:
 * - 1000 Brix points = 30% discount (max)
 * - Linear scaling: discount_pct = floor((points / 1000) * 30)
 * - Points can be used on platform fees, subscriptions, etc.
 */

export function calculateBrixDiscount(points: number): number {
  if (points >= 1000) return 30
  return Math.floor((points / 1000) * 30)
}

export function calculateDiscountedPrice(basePrice: number, brixPoints: number): number {
  const discountPercent = calculateBrixDiscount(brixPoints)
  const discountAmount = Math.round(basePrice * (discountPercent / 100))
  return basePrice - discountAmount
}

export function formatBrixDiscount(points: number): string {
  const discount = calculateBrixDiscount(points)
  return `${discount}% OFF`
}

export function getBrixTier(points: number): { name: string; color: string; minPoints: number; maxPoints: number } {
  if (points >= 1000)
    return {
      name: "Platinum",
      color: "bg-gradient-to-r from-slate-400 to-slate-600",
      minPoints: 1000,
      maxPoints: Number.POSITIVE_INFINITY,
    }
  if (points >= 500)
    return { name: "Gold", color: "bg-gradient-to-r from-amber-400 to-amber-600", minPoints: 500, maxPoints: 999 }
  if (points >= 200)
    return { name: "Silver", color: "bg-gradient-to-r from-gray-300 to-gray-500", minPoints: 200, maxPoints: 499 }
  return { name: "Bronze", color: "bg-gradient-to-r from-orange-400 to-orange-600", minPoints: 0, maxPoints: 199 }
}

// Integer math for financial accuracy (using paise instead of rupees)
export function calculateDiscountedPricePaise(basePricePaise: number, brixPoints: number): number {
  const discountPercent = calculateBrixDiscount(brixPoints)
  const discountAmountPaise = Math.round((basePricePaise * discountPercent) / 100)
  return basePricePaise - discountAmountPaise
}

// Convert rupees to paise for accurate calculations
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

// Convert paise to rupees for display
export function paiseToRupees(paise: number): number {
  return paise / 100
}

// Format price in INR
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Brix points earning rules
export const BRIX_EARNING_RULES = {
  SIGNUP_BONUS: 50,
  PROPERTY_LISTED: 100,
  PROPERTY_APPROVED: 50,
  DEAL_CLOSED: 200,
  BEST_AGENT_BONUS: 500,
  REFERRAL_BONUS: 100,
  REVIEW_RECEIVED: 25,
  FIVE_STAR_REVIEW: 50,
} as const

export type BrixEarningReason = keyof typeof BRIX_EARNING_RULES
