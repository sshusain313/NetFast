import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useElectron } from '@/hooks/useElectron';
import { logElectronStatus } from '@/lib/utils';
import { Monitor, Globe, Terminal, Smartphone } from 'lucide-react';

export const ElectronDemo: React.FC = () => {
  const { isElectron, platform, isLoading, isWindows, isMac, isLinux } = useElectron();

  const handleLogStatus = () => {
    logElectronStatus();
  };

  const handleShowAlert = () => {
    if (isElectron) {
      alert(`🚀 NetFast is running in Electron on ${platform}!`);
    } else {
      alert('🌐 NetFast is running in the browser');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
            <span>Checking environment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isElectron ? <Monitor className="h-5 w-5 text-green-600" /> : <Globe className="h-5 w-5 text-blue-600" />}
          <span>Environment Status</span>
        </CardTitle>
        <CardDescription>
          Current runtime environment information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Environment:</span>
          <Badge variant={isElectron ? "default" : "outline"} className={isElectron ? "bg-green-600" : ""}>
            {isElectron ? "Electron" : "Browser"}
          </Badge>
        </div>

        {isElectron && platform && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Platform:</span>
            <div className="flex items-center space-x-2">
              {isWindows && <Terminal className="h-4 w-4 text-blue-600" />}
              {isMac && <Smartphone className="h-4 w-4 text-gray-600" />}
              {isLinux && <Terminal className="h-4 w-4 text-green-600" />}
              <Badge variant="outline" className="text-xs">
                {platform}
              </Badge>
            </div>
          </div>
        )}

        <div className="pt-4 space-y-2">
          <Button 
            onClick={handleLogStatus} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            Log Status to Console
          </Button>
          
          <Button 
            onClick={handleShowAlert} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            Show Alert
          </Button>
        </div>

        <div className="text-xs text-stone-500 pt-2 border-t">
          <p>Check the browser console for detailed logs</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectronDemo; 