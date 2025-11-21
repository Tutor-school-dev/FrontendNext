"use client";

import { useEffect, useState } from "react";
import React from "react";
import { toast } from "sonner";
import { Check, Sparkles, TrendingUp, Crown } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../src/components/ui/tabs";
import { useTeacherSubscription } from "../../../../src/hooks/useTeacherSubscription";
import TeacherNavbar from "../../../../src/components/TeacherNavbar";

interface SubscriptionPlan {
  id: number;
  name: string;
  monthly_price: string;
  three_month_price: number;
  six_month_price: number;
  twelve_month_price: number;
  tuition_applications: number;
  benefits: string[];
  description: string;
}

export default function TeacherSubscriptionContent() {
  const { getSubscriptions, subscriptionDetail, startPayment, loading, loadingPlanId } = useTeacherSubscription();
  const [selectedDuration, setSelectedDuration] = useState<3 | 6 | 12>(6);

  useEffect(() => {
    getSubscriptions();
  }, []);

  const handleSubscribe = (planId: number) => {
    startPayment(planId, selectedDuration);
  };

  const getPriceForDuration = (plan: SubscriptionPlan, duration: 3 | 6 | 12) => {
    switch (duration) {
      case 3: return plan.three_month_price;
      case 6: return plan.six_month_price;
      case 12: return plan.twelve_month_price;
      default: return plan.six_month_price;
    }
  };

  const getPlanIcon = (index: number) => {
    switch (index) {
      case 0: return <Sparkles className="w-5 h-5" />;
      case 1: return <TrendingUp className="w-5 h-5" />;
      case 2: return <Crown className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPlanColor = (index: number) => {
    switch (index) {
      case 0: return "from-blue-500 to-cyan-500";
      case 1: return "from-purple-500 to-pink-500";
      case 2: return "from-amber-500 to-orange-500";
      default: return "from-blue-500 to-cyan-500";
    }
  };

  if (loading && subscriptionDetail.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <TeacherNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading subscription plans...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TeacherNavbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Unlock your teaching potential with our flexible subscription plans
          </p>
        </div>

        {/* Duration Selector */}
        <div className="flex justify-center mb-10">
          <Tabs value={selectedDuration.toString()} onValueChange={(v) => setSelectedDuration(parseInt(v) as 3 | 6 | 12)} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="3" className="text-sm">3 Months</TabsTrigger>
              <TabsTrigger value="6" className="text-sm relative">
                6 Months
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-[10px] px-1">Popular</Badge>
              </TabsTrigger>
              <TabsTrigger value="12" className="text-sm">12 Months</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {(subscriptionDetail.length > 0 ? subscriptionDetail : []).map((plan: SubscriptionPlan, index: number) => {
            const price = getPriceForDuration(plan, selectedDuration);
            const isPopular = index === 1;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  isPopular ? 'border-2 border-purple-500 shadow-xl scale-105' : 'border border-gray-200'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className={`bg-gradient-to-r ${getPlanColor(index)} text-white rounded-t-lg pb-8`}>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    {getPlanIcon(index)}
                  </div>
                  <CardDescription className="text-white/90 text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex flex-col flex-grow p-6 bg-white">
                  {/* Price */}
                  <div className="text-center mb-6 pb-6 border-b">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-gray-900">₹{price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      for {selectedDuration} month{selectedDuration > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {plan.tuition_applications} tuition applications included
                    </p>
                  </div>
                  
                  {/* Features */}
                  <ul className="flex-grow space-y-3">
                    {plan.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button 
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loadingPlanId !== null}
                    className={`w-full h-12 text-base font-semibold transition-all ${
                      isPopular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                    }`}
                  >
                    {loadingPlanId === plan.id ? "Processing..." : "Get Started"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            🔒 Secure payment • 💳 All major cards accepted • ↩️ 7-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}