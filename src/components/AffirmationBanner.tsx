
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

const affirmations = [
  "Today I choose presence over distraction",
  "My digital boundaries serve my highest good",
  "In stillness, I find my truest self",
  "I am strong enough to honor my commitments",
  "Each moment of discipline builds my spiritual strength",
  "I trust the wisdom of intentional limitation"
];

const AffirmationBanner = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-12 border-0 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100 overflow-hidden">
      <div className="p-8 text-center">
        <div className="animate-fade-in">
          <p className="text-xl font-light text-stone-700 italic leading-relaxed">
            "{affirmations[currentAffirmation]}"
          </p>
          <div className="flex justify-center mt-4 space-x-2">
            {affirmations.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentAffirmation ? 'bg-purple-400' : 'bg-purple-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AffirmationBanner;
