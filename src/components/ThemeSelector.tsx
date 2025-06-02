
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mountain, Waves, Trees, Sun } from 'lucide-react';
import { useTheme, SpiritualTheme } from '@/contexts/ThemeContext';

const themeOptions = [
  {
    name: 'desert',
    title: 'Desert Solitude',
    description: 'Warm sands and golden light',
    icon: Sun,
    preview: 'bg-gradient-to-r from-amber-100 to-orange-100'
  },
  {
    name: 'ocean',
    title: 'Ocean Depths',
    description: 'Calm waters and endless horizons',
    icon: Waves,
    preview: 'bg-gradient-to-r from-blue-100 to-cyan-100'
  },
  {
    name: 'forest',
    title: 'Forest Sanctuary',
    description: 'Ancient trees and morning mist',
    icon: Trees,
    preview: 'bg-gradient-to-r from-green-100 to-emerald-100'
  },
  {
    name: 'mountain',
    title: 'Mountain Peak',
    description: 'Stone silence and clear air',
    icon: Mountain,
    preview: 'bg-gradient-to-r from-slate-100 to-gray-100'
  }
];

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-light text-stone-700 flex items-center gap-2">
          <Sun size={24} className="text-amber-600" />
          Spiritual Atmosphere
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {themeOptions.map((option) => (
            <Button
              key={option.name}
              variant={theme === option.name ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                theme === option.name 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' 
                  : 'hover:bg-stone-50'
              }`}
              onClick={() => setTheme(option.name as SpiritualTheme)}
            >
              <div className={`w-12 h-8 rounded ${option.preview}`} />
              <option.icon size={20} />
              <div className="text-center">
                <div className="font-medium text-sm">{option.title}</div>
                <div className="text-xs opacity-75">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
