import React from 'react';
import { CheckCircle, Users, Briefcase, BarChart3, Shield, Database, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    title: 'Basic',
    features: [
      '5 active job postings',
      'Unlimited applications',
      'Basic candidate matching',
      'Email support',
      'Standard reports'
    ],
    current: false,
    buttonText: 'Upgrade'
  },
  {
    title: 'Professional',
    features: [
      '25 active job postings',
      'Unlimited applications',
      'Advanced candidate matching',
      'Priority email + chat support',
      'Advanced analytics & reports',
      'Assessment tools',
      'Interview scheduling',
      'ATS integration'
    ],
    current: true,
    buttonText: 'Current Plan'
  },
  {
    title: 'Enterprise',
    features: [
      'Unlimited job postings',
      'Unlimited applications',
      'AI-powered candidate matching',
      '24/7 priority support',
      'Custom analytics & white-label reports',
      'Advanced assessment suite',
      'Video interviews & scheduling',
      'Full ATS + HRIS integrations',
      'API access & webhooks',
      'Dedicated account manager',
      'SLA & compliance features'
    ],
    current: false,
    buttonText: 'Upgrade'
  }
];

export default function BillingPlans() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your hiring needs. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card key={plan.title} className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${plan.current ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-blue-500/25' : 'border-gray-200 hover:border-gray-300'}`}>
            {plan.current && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 border-blue-400 text-white px-4 py-1 shadow-lg">
                Your Current Plan
              </Badge>
            )}
            
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {plan.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Perfect for {plan.title.toLowerCase()} teams
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pb-6">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-0">
              <Button 
                className={`w-full group-hover:shadow-lg transition-all ${plan.current ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300' : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg'}`}
                size="lg"
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Not sure which plan is right for you?</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Contact our sales team for a custom quote or to schedule a demo.
        </p>
        <Button size="lg" variant="outline" className="border-2 px-8">
          Contact Sales
        </Button>
      </div>
    </div>
  );
}

