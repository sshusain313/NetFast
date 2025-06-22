
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Globe, Mail, Database, AlertTriangle } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    autoBlock: true,
    emailNotifications: true,
    systemMaintenance: false,
    debugMode: false,
    apiRateLimit: true,
    backupEnabled: true
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const systemInfo = {
    version: '2.1.4',
    uptime: '15 days, 8 hours',
    lastBackup: '2024-06-22 02:00:00',
    dbSize: '2.4 GB',
    apiCalls: '1,247,892',
    errorRate: '0.02%'
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light text-stone-700 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-600">Application Version</p>
                <p className="text-lg font-medium text-stone-800">{systemInfo.version}</p>
              </div>
              <div>
                <p className="text-sm text-stone-600">System Uptime</p>
                <p className="text-lg font-medium text-stone-800">{systemInfo.uptime}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-600">Database Size</p>
                <p className="text-lg font-medium text-stone-800">{systemInfo.dbSize}</p>
              </div>
              <div>
                <p className="text-sm text-stone-600">Last Backup</p>
                <p className="text-lg font-medium text-stone-800">{systemInfo.lastBackup}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-600">API Calls (24h)</p>
                <p className="text-lg font-medium text-stone-800">{systemInfo.apiCalls}</p>
              </div>
              <div>
                <p className="text-sm text-stone-600">Error Rate</p>
                <p className="text-lg font-medium text-green-800">{systemInfo.errorRate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Protection Settings */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light text-stone-700 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Protection Settings
          </CardTitle>
          <p className="text-stone-600">Configure system-wide protection policies</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-stone-800">Auto-Block Violations</h4>
              <p className="text-sm text-stone-600">Automatically block detected violation attempts</p>
            </div>
            <Switch 
              checked={settings.autoBlock}
              onCheckedChange={(checked) => handleSettingChange('autoBlock', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-stone-800">API Rate Limiting</h4>
              <p className="text-sm text-stone-600">Enable rate limiting for API endpoints</p>
            </div>
            <Switch 
              checked={settings.apiRateLimit}
              onCheckedChange={(checked) => handleSettingChange('apiRateLimit', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-stone-800">System Maintenance Mode</h4>
              <p className="text-sm text-stone-600">Put system in maintenance mode</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={settings.systemMaintenance}
                onCheckedChange={(checked) => handleSettingChange('systemMaintenance', checked)}
              />
              {settings.systemMaintenance && <Badge variant="destructive">Maintenance Active</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light text-stone-700 flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Notification Settings
          </CardTitle>
          <p className="text-stone-600">Configure system notifications and alerts</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-stone-800">Email Notifications</h4>
              <p className="text-sm text-stone-600">Send email alerts for critical events</p>
            </div>
            <Switch 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-stone-800">Debug Mode</h4>
              <p className="text-sm text-stone-600">Enable detailed logging and debugging</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={settings.debugMode}
                onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
              />
              {settings.debugMode && <Badge variant="outline">Debug Active</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light text-stone-700 flex items-center gap-2">
            <Database className="h-6 w-6" />
            Data Management
          </CardTitle>
          <p className="text-stone-600">Backup and data management operations</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-stone-800">Automatic Backups</h4>
              <p className="text-sm text-stone-600">Enable daily system backups</p>
            </div>
            <Switch 
              checked={settings.backupEnabled}
              onCheckedChange={(checked) => handleSettingChange('backupEnabled', checked)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Database size={16} />
              Create Manual Backup
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Globe size={16} />
              Export System Data
            </Button>
            <Button variant="destructive" className="flex items-center gap-2">
              <AlertTriangle size={16} />
              Clear Old Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button size="lg" className="bg-stone-800 hover:bg-stone-900">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
