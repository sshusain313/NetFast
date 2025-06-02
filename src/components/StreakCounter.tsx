
import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streakDays: number;
  className?: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streakDays, className = '' }) => {
  const getFlameColor = (days: number) => {
    if (days >= 40) return 'text-purple-500';
    if (days >= 21) return 'text-red-500';
    if (days >= 7) return 'text-orange-500';
    return 'text-yellow-500';
  };

  const getFlameSize = (days: number) => {
    if (days >= 40) return 40;
    if (days >= 21) return 36;
    if (days >= 7) return 32;
    return 28;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Flame 
          size={getFlameSize(streakDays)} 
          className={`${getFlameColor(streakDays)} animate-pulse`}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))'
          }}
        />
        {streakDays >= 7 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
        )}
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-stone-800">{streakDays}</div>
        <div className="text-sm text-stone-600">day streak</div>
      </div>
    </div>
  );
};

export default StreakCounter;
