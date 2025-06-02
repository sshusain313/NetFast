
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

const focusIntentions = [
  "Today I choose presence over distraction",
  "I find peace in digital silence",
  "My attention is a sacred gift I give consciously",
  "Stillness reveals wisdom within",
  "I am the guardian of my own awareness",
  "Each moment offline is a moment of growth",
  "My devices serve me, not control me",
  "In simplicity, I find clarity",
  "Digital discipline strengthens my spirit",
  "I honor my commitment to mindful living"
];

const TodaysFocusWidget: React.FC = () => {
  const [currentFocus, setCurrentFocus] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomFocus = () => {
    const randomIndex = Math.floor(Math.random() * focusIntentions.length);
    return focusIntentions[randomIndex];
  };

  const refreshFocus = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentFocus(getRandomFocus());
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    // Set initial focus based on day of year to be consistent per day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentFocus(focusIntentions[dayOfYear % focusIntentions.length]);
  }, []);

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-light text-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb size={20} className="text-amber-600" />
            Today's Focus
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshFocus}
            className="h-8 w-8 p-0 hover:bg-amber-50"
          >
            <RefreshCw size={16} className={`text-amber-600 ${isAnimating ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote 
          className={`text-stone-700 italic text-center leading-relaxed transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          "{currentFocus}"
        </blockquote>
      </CardContent>
    </Card>
  );
};

export default TodaysFocusWidget;
