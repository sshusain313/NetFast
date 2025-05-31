
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, Heart } from "lucide-react";

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "seeker",
      name: "Digital Seeker",
      price: "$19",
      period: "40 days",
      description: "Begin your journey of digital discipline",
      features: [
        "40-day digital fast protection",
        "Daily spiritual affirmations",
        "Progress tracking dashboard",
        "Basic DNS filtering",
        "Email support"
      ],
      color: "from-amber-400 to-orange-500",
      icon: <Clock size={24} className="text-white" />
    },
    {
      id: "practitioner", 
      name: "Spiritual Practitioner",
      price: "$49",
      period: "4 months",
      description: "Deepen your practice with extended discipline",
      features: [
        "120-day transformative journey",
        "Advanced website blocking",
        "Weekly reflection prompts",
        "Community support access",
        "Priority customer care",
        "Custom affirmation library"
      ],
      color: "from-green-400 to-emerald-500",
      icon: <Shield size={24} className="text-white" />,
      popular: true
    },
    {
      id: "master",
      name: "Digital Master",
      price: "$99", 
      period: "1 year",
      description: "Achieve complete digital sovereignty",
      features: [
        "365-day mastery program",
        "Premium DNS protection",
        "Personalized coaching calls",
        "Advanced analytics & insights",
        "White-glove onboarding",
        "Lifetime community access",
        "Custom spiritual curriculum"
      ],
      color: "from-purple-400 to-indigo-500",
      icon: <Heart size={24} className="text-white" />
    }
  ];

  const handleCommitment = (planId: string) => {
    setSelectedPlan(planId);
    // Here would be the actual subscription logic
    console.log(`Committing to ${planId} plan`);
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light text-stone-700 mb-6">Sacred Commitment Ceremony</h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
          Choose the path that speaks to your soul. Each subscription includes complete DNS protection, 
          spiritual guidance, and unwavering support for your digital discipline journey.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${plan.popular ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1">
                Most Chosen Path
              </Badge>
            )}
            
            <CardHeader className="text-center pb-8">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${plan.color} mx-auto mb-6 flex items-center justify-center shadow-lg`}>
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-light text-stone-700 mb-2">{plan.name}</CardTitle>
              <p className="text-stone-600 italic">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-light text-stone-800">{plan.price}</span>
                <span className="text-stone-500 ml-2">for {plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-stone-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleCommitment(plan.id)}
                className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white border-0 py-3 text-lg font-medium transition-all duration-300`}
                disabled={selectedPlan === plan.id}
              >
                {selectedPlan === plan.id ? 'Commitment Made ✨' : 'Make Sacred Commitment'}
              </Button>
              
              <p className="text-center text-sm text-stone-500 mt-4">
                One-time payment • Cancel with 24hr reflection period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-12 p-8 bg-gradient-to-r from-stone-100 to-amber-100 rounded-2xl">
        <h3 className="text-2xl font-light text-stone-700 mb-4">Your Sacred Promise</h3>
        <p className="text-stone-600 leading-relaxed max-w-3xl mx-auto">
          By choosing NetFast, you make a sacred commitment to your spiritual growth. Our DNS protection 
          will shield you from digital distractions, but true transformation comes from within. 
          We walk this path together, with compassion, understanding, and unwavering support for your highest good.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
