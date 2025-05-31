
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useElectronDNS } from "@/hooks/useElectronDNS";
import { useToast } from "@/hooks/use-toast";

const fastingOptions = [
  {
    title: "40 Days of Clarity",
    description: "A traditional period of spiritual discipline and digital detox",
    duration: "40 days",
    price: "$19",
    color: "from-amber-400 to-orange-500",
    filterType: "opendns"
  },
  {
    title: "4 Months of Transformation", 
    description: "Deep spiritual growth through sustained digital discipline",
    duration: "120 days",
    price: "$49",
    color: "from-green-400 to-emerald-500",
    filterType: "cleanBrowsing"
  },
  {
    title: "1 Year of Mastery",
    description: "Complete digital sovereignty and spiritual maturity",
    duration: "365 days",
    price: "$99",
    color: "from-purple-400 to-indigo-500",
    filterType: "cloudflareFamily"
  }
];

interface FastingCardProps {
  onStartFast: () => void;
}

const FastingCard = ({ onStartFast }: FastingCardProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const { 
    dnsStatus, 
    isElectron, 
    applyDNSFilter, 
    requestAdminPrivileges,
    checkDNSStatus 
  } = useElectronDNS();
  const { toast } = useToast();

  const handleBeginFast = async (option: typeof fastingOptions[0]) => {
    if (!isElectron) {
      toast({
        title: "Desktop App Required",
        description: "DNS protection requires the NetFast desktop application. Please download and install the desktop version.",
        variant: "destructive"
      });
      return;
    }

    setIsActivating(true);
    setSelectedPlan(option.title);

    try {
      // First request admin privileges
      const adminResult = await requestAdminPrivileges();
      if (!adminResult.success) {
        toast({
          title: "Admin Access Required",
          description: "NetFast needs administrator privileges to protect your digital discipline. Please grant access when prompted.",
          variant: "destructive"
        });
        return;
      }

      // Apply the DNS filter
      const filterResult = await applyDNSFilter(option.filterType);
      
      if (filterResult.success) {
        toast({
          title: "Sacred Protection Activated! 🛡️",
          description: `Your ${option.title} journey has begun. DNS filtering is now protecting your spiritual growth.`,
        });
        
        // Start the subscription process
        onStartFast();
        
        // Check status to confirm
        await checkDNSStatus();
      } else {
        throw new Error(filterResult.error || 'Failed to activate DNS protection');
      }
    } catch (error) {
      toast({
        title: "Protection Setup Failed",
        description: `Unable to activate DNS protection: ${error.message}. Please try again or contact support.`,
        variant: "destructive"
      });
      setSelectedPlan(null);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light text-stone-700 mb-4">Choose Your Sacred Journey</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Each path offers real DNS protection from digital distractions while nurturing your spiritual growth
        </p>
        
        {!isElectron && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <AlertTriangle size={20} />
              <span className="font-medium">Desktop App Required for DNS Protection</span>
            </div>
            <p className="text-sm text-amber-700 mt-2">
              You're viewing the web version. Download the desktop app for real DNS filtering.
            </p>
          </div>
        )}
        
        {isElectron && dnsStatus?.isFiltered && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <CheckCircle size={20} />
              <span className="font-medium">DNS Protection Active</span>
            </div>
            <p className="text-sm text-green-700 mt-2">
              Your digital discipline is being protected.
            </p>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {fastingOptions.map((option, index) => (
          <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-6">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${option.color} mx-auto mb-4 flex items-center justify-center`}>
                <Shield className="text-white" size={24} />
              </div>
              <CardTitle className="text-xl font-light text-stone-700">{option.title}</CardTitle>
              <Badge variant="outline" className="mx-auto">{option.duration}</Badge>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-stone-600 mb-6 leading-relaxed">{option.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-light text-stone-800">{option.price}</span>
                <span className="text-stone-500 ml-1">total</span>
              </div>
              <Button 
                onClick={() => handleBeginFast(option)}
                disabled={isActivating || selectedPlan === option.title}
                className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 text-white border-0`}
              >
                {isActivating && selectedPlan === option.title ? (
                  "Activating Protection..."
                ) : selectedPlan === option.title ? (
                  "Protection Active ✨"
                ) : (
                  "Begin Sacred Fast"
                )}
              </Button>
              
              {isElectron && (
                <p className="text-xs text-stone-500 mt-3">
                  Includes real DNS filtering & protection monitoring
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FastingCard;
