
import React, { useEffect, useState } from 'react';
import { Sparkles, Award, Heart } from 'lucide-react';

interface MilestoneCelebrationProps {
  daysCompleted: number;
  onCelebrationComplete?: () => void;
}

const milestones = [
  { days: 7, title: "First Week", icon: Sparkles, color: "text-yellow-500" },
  { days: 21, title: "Habit Formed", icon: Award, color: "text-orange-500" },
  { days: 40, title: "Sacred Completion", icon: Heart, color: "text-red-500" },
];

const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  daysCompleted,
  onCelebrationComplete
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<typeof milestones[0] | null>(null);

  useEffect(() => {
    const milestone = milestones.find(m => m.days === daysCompleted);
    if (milestone) {
      setCurrentMilestone(milestone);
      setShowCelebration(true);
      
      const timer = setTimeout(() => {
        setShowCelebration(false);
        onCelebrationComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [daysCompleted, onCelebrationComplete]);

  if (!showCelebration || !currentMilestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-scale-in">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center animate-breathe">
            <currentMilestone.icon size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-light text-stone-800 mb-2">
            Milestone Achieved! ✨
          </h2>
          <h3 className="text-xl font-medium text-stone-700">
            {currentMilestone.title}
          </h3>
        </div>
        
        <p className="text-stone-600 mb-6">
          You've completed {daysCompleted} days of your spiritual journey. 
          Your dedication is inspiring!
        </p>
        
        {/* Particle effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full animate-pulse"
              style={{
                left: `${20 + (i % 4) * 20}%`,
                top: `${20 + Math.floor(i / 4) * 20}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestoneCelebration;
