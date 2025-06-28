import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Globe, Mail, Database, AlertTriangle, Loader2 } from "lucide-react";
import { AdminSettings as AdminSettingsType, SystemInfo } from "@/services/api";

interface AdminSettingsProps {
  settings: AdminSettingsType | null;
  systemInfo: SystemInfo | null;
  onUpdateSettings: (newSettings: Partial<AdminSettingsType>) => Promise<boolean>;
  loading: boolean;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ 
  settings, 
  systemInfo, 
  onUpdateSettings, 
  loading 
}) => {
  const [localSettings, setLocalSettings] = useState<AdminSettingsType | null>(settings);
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key: keyof AdminSettingsType, value: boolean) => {
    if (localSettings) {
      setLocalSettings(prev => ({ ...prev!, [key]: value }));
    }
  };

  const handleSaveSettings = async () => {
    if (!localSettings) return;
    
    setSaving(true);
    const success = await onUpdateSettings(localSettings);
    setSaving(false);
    
    if (success) {
      // Settings were updated successfully
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-stone-600" />
      </div>
    );
  }

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
                <p className="text-lg font-medium text-stone-800">{systemInfo?.version || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-stone-600">System Uptime</p>
                <p className="text-lg font-medium text-stone-800">{systemInfo?.uptime || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-600">Database Size</p>
                <p className="text-lg font-medium text-stone-800">{systemInfo?.dbSize || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-stone-600">Last Backup</p>
                <p className="text-lg font-medium text-stone-800">
                  {systemInfo?.lastBackup ? new Date(systemInfo.lastBackup).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-600">API Calls (24h)</p>
                <p className="text-lg font-medium text-stone-800">{systemInfo?.apiCalls || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-stone-600">Error Rate</p>
                <p className="text-lg font-medium text-green-800">{systemInfo?.errorRate || 'N/A'}</p>
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
              checked={localSettings?.autoBlock || false}
              onCheckedChange={(checked) => handleSettingChange('autoBlock', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-stone-800">API Rate Limiting</h4>
              <p className="text-sm text-stone-600">Enable rate limiting for API endpoints</p>
            </div>
            <Switch 
              checked={localSettings?.apiRateLimit || false}
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
                checked={localSettings?.systemMaintenance || false}
                onCheckedChange={(checked) => handleSettingChange('systemMaintenance', checked)}
              />
              {localSettings?.systemMaintenance && <Badge variant="destructive">Maintenance Active</Badge>}
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
              checked={localSettings?.emailNotifications || false}
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
                checked={localSettings?.debugMode || false}
                onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
              />
              {localSettings?.debugMode && <Badge variant="outline">Debug Active</Badge>}
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
              checked={localSettings?.backupEnabled || false}
              onCheckedChange={(checked) => handleSettingChange('backupEnabled', checked)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Database size={16} />
              Create Manual Backup
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
npm               <Globe size={16} />
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
        <Button 
          size="lg" 
          className="bg-stone-800 hover:bg-stone-900"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            'Save All Settings'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
