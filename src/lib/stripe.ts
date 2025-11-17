import Stripe from 'stripe'

// Check if we're in a server environment
const isServer = typeof window === 'undefined'

// Server-side Stripe instance (only for API routes)
export const stripe = isServer ? new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia',
  typescript: true,
}) : null

// Client-side Stripe publishable key
export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
}

// Plan configuration for Stripe
export const STRIPE_PLANS = {
  pro_monthly: {
    price: 'prod_TRA9ljZFxq7tYO', // Live Monthly price ID
    name: 'Professional Plan (Monthly)',
  },
  pro_annual: {
    price: 'prod_TRA9ljZFxq7tYO', // Live Annual price ID (20% discount)
    name: 'Professional Plan (Annual)',
  },
} as const

export type StripePlan = keyof typeof STRIPE_PLANS