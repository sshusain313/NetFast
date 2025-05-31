
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Shield, Wifi, Bell, Moon, Volume2, Lock } from "lucide-react";
import { useElectronDNS } from "@/hooks/useElectronDNS";
import Header from "@/components/Header";

const Settings = () => {
  const { dnsStatus, isLoading, checkDNSStatus, applyDNSFilter, removeDNSFilter, requestAdminPrivileges } = useElectronDNS();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sounds, setSounds] = useState(true);

  useEffect(() => {
    checkDNSStatus();
  }, []);

  const handleToggleProtection = async () => {
    if (dnsStatus?.isFiltered) {
      await removeDNSFilter();
    } else {
      const adminResult = await requestAdminPrivileges();
      if (adminResult.success) {
        await applyDNSFilter('opendns');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30">
      <Header />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-800 mb-2">Settings</h1>
          <p className="text-stone-600">Customize your digital discipline journey</p>
        </div>

        <div className="space-y-6">
          {/* DNS Protection Settings */}
          <Card className="border-stone-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-800">
                <Shield className="w-5 h-5 text-amber-600" />
                DNS Protection
              </CardTitle>
              <CardDescription>
                Control your digital environment with DNS filtering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Protection Status</Label>
                  <p className="text-xs text-stone-500 mt-1">
                    {dnsStatus?.isFiltered ? 'DNS filtering is active' : 'DNS filtering is disabled'}
                  </p>
                </div>
                <Badge variant={dnsStatus?.isFiltered ? "default" : "outline"} className="bg-green-50 text-green-700 border-green-200">
                  {dnsStatus?.isFiltered ? 'Protected' : 'Unprotected'}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable DNS Filtering</Label>
                  <p className="text-xs text-stone-500 mt-1">
                    Block distracting websites at the network level
                  </p>
                </div>
                <Switch 
                  checked={dnsStatus?.isFiltered || false}
                  onCheckedChange={handleToggleProtection}
                  disabled={isLoading}
                />
              </div>

              {dnsStatus?.currentDNS && (
                <div className="p-3 bg-stone-50 rounded-lg">
                  <Label className="text-xs text-stone-600">Current DNS</Label>
                  <p className="text-sm font-mono text-stone-800">{dnsStatus.currentDNS}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Settings */}
          <Card className="border-stone-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-800">
                <Lock className="w-5 h-5 text-amber-600" />
                Subscription
              </CardTitle>
              <CardDescription>
                Manage your spiritual discipline commitment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Current Plan</Label>
                  <p className="text-xs text-stone-500 mt-1">Digital Monk - 40 Day Journey</p>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Days Remaining</Label>
                  <p className="text-xs text-stone-500 mt-1">Stay committed to your path</p>
                </div>
                <span className="text-lg font-light text-stone-800">32 days</span>
              </div>

              <Separator />

              <Button variant="outline" className="w-full border-stone-200 hover:bg-stone-50">
                View Subscription Details
              </Button>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className="border-stone-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-800">
                <Wifi className="w-5 h-5 text-amber-600" />
                App Preferences
              </CardTitle>
              <CardDescription>
                Customize your mindful experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-stone-600" />
                  <div>
                    <Label className="text-sm font-medium">Daily Affirmations</Label>
                    <p className="text-xs text-stone-500 mt-1">Receive gentle reminders</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-stone-600" />
                  <div>
                    <Label className="text-sm font-medium">Dark Mode</Label>
                    <p className="text-xs text-stone-500 mt-1">Gentle on the eyes</p>
                  </div>
                </div>
                <Switch 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-stone-600" />
                  <div>
                    <Label className="text-sm font-medium">Meditation Sounds</Label>
                    <p className="text-xs text-stone-500 mt-1">Peaceful background audio</p>
                  </div>
                </div>
                <Switch 
                  checked={sounds}
                  onCheckedChange={setSounds}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
