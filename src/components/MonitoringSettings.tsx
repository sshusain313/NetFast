
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Monitor, Wifi, AlertTriangle } from "lucide-react";

interface MonitoringSettings {
  autoStartOnBoot: boolean;
  backgroundService: boolean;
  usageMonitoring: boolean;
  screenshotDetection: boolean;
  proxyVpnDetection: boolean;
}

const MonitoringSettings = () => {
  const [settings, setSettings] = useState<MonitoringSettings>({
    autoStartOnBoot: true,
    backgroundService: true,
    usageMonitoring: false,
    screenshotDetection: false,
    proxyVpnDetection: true
  });
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && !!window.electronAPI);
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('monitoring_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const updateSetting = async (key: keyof MonitoringSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('monitoring_settings', JSON.stringify(newSettings));

    // Update Electron backend if available
    if (isElectron && window.electronAPI.updateMonitoringSettings) {
      try {
        await window.electronAPI.updateMonitoringSettings(newSettings);
      } catch (error) {
        console.error('Failed to update monitoring settings:', error);
      }
    }
  };

  return (
    <Card className="border-stone-200/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-stone-800">
          <Shield className="w-5 h-5 text-blue-600" />
          Protection Monitoring
        </CardTitle>
        <CardDescription>
          Configure how NetFast protects your spiritual discipline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-Start Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-stone-600" />
            <Label className="text-sm font-medium">System Protection</Label>
          </div>
          
          <div className="flex items-center justify-between pl-6">
            <div>
              <Label className="text-sm font-medium">Auto-Start on Boot</Label>
              <p className="text-xs text-stone-500 mt-1">
                NetFast starts automatically when your computer boots
              </p>
            </div>
            <Switch 
              checked={settings.autoStartOnBoot}
              onCheckedChange={(value) => updateSetting('autoStartOnBoot', value)}
            />
          </div>

          <div className="flex items-center justify-between pl-6">
            <div>
              <Label className="text-sm font-medium">Background Service</Label>
              <p className="text-xs text-stone-500 mt-1">
                Continues protection even if the app window is closed
              </p>
            </div>
            <Switch 
              checked={settings.backgroundService}
              onCheckedChange={(value) => updateSetting('backgroundService', value)}
            />
          </div>
        </div>

        <Separator />

        {/* Network Monitoring */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-stone-600" />
            <Label className="text-sm font-medium">Network Monitoring</Label>
          </div>
          
          <div className="flex items-center justify-between pl-6">
            <div>
              <Label className="text-sm font-medium">Proxy/VPN Detection</Label>
              <p className="text-xs text-stone-500 mt-1">
                Monitors for attempts to bypass DNS filtering
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={settings.proxyVpnDetection}
                onCheckedChange={(value) => updateSetting('proxyVpnDetection', value)}
              />
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Recommended
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Usage Monitoring */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-stone-600" />
            <Label className="text-sm font-medium">Usage Monitoring</Label>
            <Badge variant="outline" className="text-xs">Optional</Badge>
          </div>
          
          <div className="flex items-center justify-between pl-6">
            <div>
              <Label className="text-sm font-medium">App Usage Tracking</Label>
              <p className="text-xs text-stone-500 mt-1">
                Track which applications are being used
              </p>
            </div>
            <Switch 
              checked={settings.usageMonitoring}
              onCheckedChange={(value) => updateSetting('usageMonitoring', value)}
            />
          </div>

          <div className="flex items-center justify-between pl-6">
            <div>
              <Label className="text-sm font-medium">Screenshot Detection</Label>
              <p className="text-xs text-stone-500 mt-1">
                Monitor for potential workaround attempts
              </p>
            </div>
            <Switch 
              checked={settings.screenshotDetection}
              onCheckedChange={(value) => updateSetting('screenshotDetection', value)}
            />
          </div>
        </div>

        {(settings.usageMonitoring || settings.screenshotDetection) && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">Privacy Notice</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              These features collect usage data locally on your device. Data is only shared with your spiritual sponsor if configured.
            </p>
          </div>
        )}

        {!isElectron && (
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <p className="text-sm text-stone-600">
              Advanced monitoring features require the NetFast desktop application.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonitoringSettings;
