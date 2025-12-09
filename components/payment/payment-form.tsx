"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Lock, Shield, Loader2 } from "lucide-react"
import { processPayment } from "@/lib/actions/payments"
import type { Payment } from "@/lib/types"

interface PaymentFormProps {
  amount: number
  paymentType: Payment["payment_type"]
  leadId?: string
  onSuccess: (transactionId: string) => void
  onCancel: () => void
}

export function PaymentForm({ amount, paymentType, leadId, onSuccess, onCancel }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Basic validation
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Please enter a valid 16-digit card number")
      setIsLoading(false)
      return
    }

    if (expiry.length !== 5) {
      setError("Please enter a valid expiry date (MM/YY)")
      setIsLoading(false)
      return
    }

    if (cvv.length !== 3) {
      setError("Please enter a valid 3-digit CVV")
      setIsLoading(false)
      return
    }

    const result = await processPayment({
      lead_id: leadId,
      amount,
      payment_type: paymentType,
      card_number: cardNumber.replace(/\s/g, ""),
      expiry,
      cvv,
    })

    if (result.success) {
      onSuccess(result.data.transaction_id)
    } else {
      setError(result.error || "Payment failed. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Secure Payment</CardTitle>
        <CardDescription>Enter your card details to complete the payment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Display */}
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-3xl font-bold text-primary">₹{amount.toLocaleString()}</p>
          </div>

          {/* Card Holder Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Card Holder Name</Label>
            <Input
              id="name"
              placeholder="Name on card"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                required
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <div className="relative">
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  maxLength={3}
                  required
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <Shield className="w-4 h-4" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${amount.toLocaleString()}`
              )}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>

          {/* Test Card Info */}
          <div className="text-xs text-center text-muted-foreground bg-muted p-2 rounded">
            <p className="font-medium">Test Mode</p>
            <p>Use any 16-digit card number, future expiry, and any 3-digit CVV</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
