import React from 'react';
import { isElectron, getElectronPlatform } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Monitor, Globe } from 'lucide-react';

interface ElectronStatusProps {
  showIcon?: boolean;
  className?: string;
}

export const ElectronStatus: React.FC<ElectronStatusProps> = ({ 
  showIcon = true, 
  className = "" 
}) => {
  const isElectronApp = isElectron();
  const platform = getElectronPlatform();

  if (!isElectronApp) {
    return (
      <Badge variant="outline" className={`text-xs ${className}`}>
        {showIcon && <Globe className="w-3 h-3 mr-1" />}
        Browser
      </Badge>
    );
  }

  return (
    <Badge variant="default" className={`text-xs bg-green-600 hover:bg-green-700 ${className}`}>
      {showIcon && <Monitor className="w-3 h-3 mr-1" />}
      Electron {platform && `(${platform})`}
    </Badge>
  );
};

export default ElectronStatus; 