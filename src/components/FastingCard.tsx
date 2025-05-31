
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fastingOptions = [
  {
    title: "40 Days of Clarity",
    description: "A traditional period of spiritual discipline and digital detox",
    duration: "40 days",
    price: "$19",
    color: "from-amber-400 to-orange-500"
  },
  {
    title: "4 Months of Transformation", 
    description: "Deep spiritual growth through sustained digital discipline",
    duration: "120 days",
    price: "$49",
    color: "from-green-400 to-emerald-500"
  },
  {
    title: "1 Year of Mastery",
    description: "Complete digital sovereignty and spiritual maturity",
    duration: "365 days",
    price: "$99",
    color: "from-purple-400 to-indigo-500"
  }
];

interface FastingCardProps {
  onStartFast: () => void;
}

const FastingCard = ({ onStartFast }: FastingCardProps) => {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light text-stone-700 mb-4">Choose Your Sacred Journey</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Each path offers protection from digital distractions while nurturing your spiritual growth
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {fastingOptions.map((option, index) => (
          <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-6">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${option.color} mx-auto mb-4 flex items-center justify-center`}>
                <span className="text-white text-2xl">🌱</span>
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
                onClick={onStartFast}
                className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 text-white border-0`}
              >
                Begin Sacred Fast
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FastingCard;
