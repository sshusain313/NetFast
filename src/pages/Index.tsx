
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Calendar, Clock, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import FastingCard from "@/components/FastingCard";
import AffirmationBanner from "@/components/AffirmationBanner";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import CircularProgress from "@/components/CircularProgress";
import MilestoneCelebration from "@/components/MilestoneCelebration";
import StreakCounter from "@/components/StreakCounter";
import { useSubscriptionReminder } from "@/hooks/useSubscriptionReminder";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const [currentFast, setCurrentFast] = useState({
    type: "40 Days of Clarity",
    daysCompleted: 12,
    totalDays: 40,
    startDate: "2024-05-01",
    isActive: true
  });

  const [showSubscription, setShowSubscription] = useState(false);
  const { timeBasedBackground } = useTheme();

  // Mock subscription data - in real app this would come from context/state
  const [subscriptionData, setSubscriptionData] = useState({
    subscribed: true,
    subscriptionTier: "Digital Seeker",
    subscriptionEnd: "2025-06-06T00:00:00Z" // 5 days from now for demo
  });

  const { daysUntilExpiry, showReminderBanner } = useSubscriptionReminder(subscriptionData);

  const progressPercentage = (currentFast.daysCompleted / currentFast.totalDays) * 100;

  return (
    <div className={`min-h-screen ${timeBasedBackground}`}>
      <Header />
      
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <AffirmationBanner />
        
        {/* Subscription Renewal Reminder */}
        {showReminderBanner && (
          <Alert className="mb-8 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Sacred Commitment Renewal:</strong> Your {subscriptionData.subscriptionTier} subscription expires in {daysUntilExpiry} day{daysUntilExpiry === 1 ? '' : 's'}. 
              <Button 
                variant="link" 
                className="p-0 ml-2 text-amber-700 underline h-auto"
                onClick={() => setShowSubscription(true)}
              >
                Renew or enhance your journey →
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-light mb-6 text-stone-800 tracking-wide">
            Welcome to Your Journey
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            A sacred space for digital discipline, where technology serves your spiritual growth
          </p>
        </div>

        {/* Dashboard Widgets Grid */}
        <div className="grid lg:grid-cols-1 gap-6 mb-12">
          <div className="flex justify-center">
            {currentFast.isActive && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm w-full max-w-md">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-light text-stone-700 mb-4">
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <StreakCounter streakDays={currentFast.daysCompleted} className="mb-6" />
                  <CircularProgress 
                    progress={progressPercentage}
                    size={140}
                    className="mb-4"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-light text-stone-800">{Math.round(progressPercentage)}%</div>
                      <div className="text-sm text-stone-600">Complete</div>
                    </div>
                  </CircularProgress>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Current Fast Dashboard */}
        {currentFast.isActive ? (
          <Card className="mb-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-light text-stone-700 mb-2">
                {currentFast.type}
              </CardTitle>
              <Badge variant="secondary" className="bg-sage-100 text-sage-800 px-4 py-2">
                Day {currentFast.daysCompleted} of {currentFast.totalDays}
              </Badge>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg transition-shadow">
                  <Calendar className="mx-auto mb-3 text-amber-600" size={32} />
                  <div className="text-2xl font-light text-stone-800">{currentFast.daysCompleted}</div>
                  <div className="text-stone-600">Days Completed</div>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
                  <Clock className="mx-auto mb-3 text-green-600" size={32} />
                  <div className="text-2xl font-light text-stone-800">{currentFast.totalDays - currentFast.daysCompleted}</div>
                  <div className="text-stone-600">Days Remaining</div>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-lg transition-shadow">
                  <Moon className="mx-auto mb-3 text-purple-600" size={32} />
                  <div className="text-2xl font-light text-stone-800">Active</div>
                  <div className="text-stone-600">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <FastingCard onStartFast={() => setShowSubscription(true)} />
        )}

        {/* Milestone Celebration */}
        <MilestoneCelebration daysCompleted={currentFast.daysCompleted} />

        {/* Subscription Plans */}
        {showSubscription && <SubscriptionPlans />}

        {/* Daily Reflection */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-stone-100 to-amber-100">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-stone-700 flex items-center gap-3">
              <Sun className="text-amber-600" size={28} />
              Today's Reflection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg italic text-stone-700 leading-relaxed">
              "In the depths of silence, we discover the voice of our soul. Today, I choose presence over 
              distraction, depth over surface, and peace over chaos."
            </blockquote>
            <cite className="block mt-4 text-stone-500">— Your Digital Sanctuary</cite>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
