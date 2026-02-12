/**
 * Stripe Provider Configuration
 * 
 * Centralized configuration for Stripe payment processing:
 * - Payment intents
 * - Subscriptions
 * - Customer management
 * - Webhooks
 */

import Stripe from 'stripe'

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

/**
 * Create a payment intent
 */
export async function createPaymentIntent(amount: number, currency = 'usd') {
  return await stripe.paymentIntents.create({
    amount,
    currency,
  })
}

/**
 * Create a subscription
 */
export async function createSubscription(customerId: string, priceId: string) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  })
}

/**
 * Verify webhook signature
 */
export function verifyWebhook(payload: string, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}

export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
}
