'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Zap, 
  Crown, 
  Rocket, 
  Star,
  Users,
  Loader2,
  Info
} from 'lucide-react'
import BackButton from '@/components/back-button'
import { getStripePublishableKey, STRIPE_PLANS, type StripePlan } from '@/lib/stripe'
import { useAuth } from '@/contexts/auth-context'

const plans = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    description: 'Perfect for getting started with basic prompt engineering',
    features: [
      '10 conversions per month',
      'Basic JSON formatting',
      'Community support',
      'Conversion history'
    ],
    icon: <Star className="h-8 w-8" />,
    popular: true
  },
  {
    id: 'pro',
    name: 'Professional',
    monthlyPrice: 19,
    description: 'For serious prompt engineers and power users',
    features: [
      'Unlimited conversions',
      'Advanced JSON formatting',
      'Priority support',
      'Custom templates',
      'Export to multiple formats',
      'API access'
    ],
    icon: <Rocket className="h-8 w-8" />,
    popular: false,
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: null,
    description: 'For teams and organizations with advanced needs',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'White-label options',
      'Advanced analytics',
      'SLA guarantee'
    ],
    icon: <Crown className="h-8 w-8" />,
    popular: false,
    recommended: false
  }
]

export default function PricingPage() {
  const { isDemo } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [isAnnual, setIsAnnual] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getDisplayPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === null) return 'Custom'
    if (plan.monthlyPrice === 0) return '$0'
    
    const monthlyPrice = plan.monthlyPrice
    const annualPrice = monthlyPrice * 12 * 0.8 // 20% discount
    
    const displayPrice = isAnnual ? `$${annualPrice.toFixed(0)}` : `$${monthlyPrice}`
    console.log(`Plan ${plan.name}: Monthly $${monthlyPrice} -> ${isAnnual ? 'Annual' : 'Monthly'} ${displayPrice}`)
    return displayPrice
  }

  const getBillingText = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === null) return ''
    if (plan.monthlyPrice === 0) return ''
    return isAnnual ? '/year' : '/month'
  }

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      // Free plan - just redirect to main app
      window.location.href = '/'
      return
    }

    if (planId === 'enterprise') {
      // Enterprise plan - show contact form or redirect to contact page
      alert('Please contact us for Enterprise plan pricing')
      return
    }

    setIsLoading(true)
    
    try {
      const stripePublishableKey = getStripePublishableKey()
      
      if (!stripePublishableKey || stripePublishableKey.includes('your_publishable_key_here')) {
        alert('Stripe is not configured. In demo mode, you can explore the pricing interface.')
        setIsLoading(false)
        return
      }

        // Load Stripe.js dynamically
      const { loadStripe } = await import('@stripe/stripe-js')
      const stripePromise = loadStripe(stripePublishableKey)
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      // Determine which Stripe price to use
      const planKey: StripePlan = isAnnual ? 'pro_annual' : 'pro_monthly'
      const stripePlan = STRIPE_PLANS[planKey]

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: stripePlan.price,
          planId: planId,
          billingCycle: isAnnual ? 'annual' : 'monthly',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert(`Failed to start subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Select the perfect plan for your prompt engineering needs
          </p>
          
          {/* Demo Mode Alert */}
          {isDemo && (
            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo Mode:</strong> Stripe is not configured. You can explore the pricing interface, but subscriptions won't be processed.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Billing Toggle */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Billing Cycle</CardTitle>
            <CardDescription>
              Save 20% with annual billing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isAnnual ? 'annual' : 'monthly'} onValueChange={(value) => {
              console.log('Billing toggle changed to:', value)
              setIsAnnual(value === 'annual')
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">
                  Annual (Save 20%)
                  {isAnnual && <CheckCircle className="ml-2 h-4 w-4 text-green-600" />}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {isAnnual && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">You're saving 20% with annual billing!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`shadow-md hover:shadow-lg transition-all cursor-pointer ${
                selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
              } ${isAnnual && plan.monthlyPrice && plan.monthlyPrice > 0 ? 'border-green-200 dark:border-green-800' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {plan.icon}
                    <span className="text-xl font-bold">{plan.name}</span>
                  </div>
                  <div className="flex gap-2">
                    {plan.popular && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                    {plan.recommended && (
                      <Badge variant="outline">Recommended</Badge>
                    )}
                  </div>
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-primary">
                  {getDisplayPrice(plan)}
                  {getBillingText(plan) && (
                    <span className="text-lg text-muted-foreground">
                      {getBillingText(plan)}
                    </span>
                  )}
                  {isAnnual && plan.monthlyPrice && plan.monthlyPrice > 0 && (
                    <div className="text-sm text-green-600 font-normal">
                      Save 20% (${(plan.monthlyPrice * 12 * 0.2).toFixed(0)}/year)
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>
                  {plan.description}
                </CardDescription>
                
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
                <CardContent className="pt-4">
                <Button 
                  className="w-full" 
                  variant={selectedPlan === plan.id ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : plan.id === 'free' ? (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Get Started Free
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Subscribe Now
                      {isAnnual && plan.monthlyPrice && plan.monthlyPrice > 0 && (
                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                          Save ${(plan.monthlyPrice * 12 * 0.2).toFixed(0)}/yr
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>
              Compare all plans and choose the right one for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Feature</th>
                    <th className="text-center p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Free
                      </div>
                    </th>
                    <th className="text-center p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <Rocket className="h-4 w-4" />
                        Professional
                      </div>
                    </th>
                    <th className="text-center p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Enterprise
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    'Monthly conversions',
                    'Unlimited conversions',
                    'Advanced formatting',
                    'Priority support',
                    'API access',
                    'Custom integrations'
                  ].map((feature) => (
                    <tr key={feature} className="border-b">
                      <td className="p-3 text-sm">{feature}</td>
                      <td className="text-center p-3">
                        <Badge variant="outline">10/mo</Badge>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant="default">Unlimited</Badge>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant="default">Unlimited</Badge>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant="default">Unlimited</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Common questions about our pricing and plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Can I switch plans anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Is there a free trial?</h4>
              <p className="text-sm text-muted-foreground">
                The free plan is always free with no time limit. Professional plans come with a 14-day money-back guarantee.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}