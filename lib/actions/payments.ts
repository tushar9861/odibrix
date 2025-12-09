"use server"

import { createClient } from "@/lib/supabase/server"
import type { Payment } from "@/lib/types"

export async function createPayment(data: {
  lead_id?: string
  amount: number
  payment_type: Payment["payment_type"]
  metadata?: Record<string, unknown>
}) {
  const supabase = await createClient()

  const paymentData = {
    ...data,
    currency: "INR",
    payment_status: "pending" as const,
  }

  const { data: payment, error } = await supabase.from("payments").insert(paymentData).select().single()

  if (error) {
    console.error("Error creating payment:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data: payment }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: Payment["payment_status"],
  transactionId?: string,
) {
  const supabase = await createClient()

  const updateData: Partial<Payment> = { payment_status: status }
  if (transactionId) {
    updateData.transaction_id = transactionId
  }

  const { data, error } = await supabase.from("payments").update(updateData).eq("id", paymentId).select().single()

  if (error) {
    console.error("Error updating payment:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getPayments() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// Simulated payment processing - replace with Stripe in production
export async function processPayment(data: {
  lead_id?: string
  amount: number
  payment_type: Payment["payment_type"]
  card_number?: string
  expiry?: string
  cvv?: string
}) {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Create payment record
  const paymentResult = await createPayment({
    lead_id: data.lead_id,
    amount: data.amount,
    payment_type: data.payment_type,
    metadata: {
      simulated: true,
      card_last_four: data.card_number?.slice(-4),
    },
  })

  if (!paymentResult.success) {
    return paymentResult
  }

  // Simulate successful payment (in production, this would be Stripe's response)
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`

  // Update payment status to completed
  const updateResult = await updatePaymentStatus(paymentResult.data.id, "completed", transactionId)

  if (!updateResult.success) {
    return updateResult
  }

  return {
    success: true,
    data: {
      ...updateResult.data,
      transaction_id: transactionId,
    },
  }
}
