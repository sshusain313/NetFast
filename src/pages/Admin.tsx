import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Shield, CreditCard, AlertTriangle, Settings, BarChart3, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminDevices from "@/components/admin/AdminDevices";
import AdminSubscriptions from "@/components/admin/AdminSubscriptions";
import AdminViolations from "@/components/admin/AdminViolations";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSettings from "@/components/admin/AdminSettings";
import { useAdmin } from "@/hooks/useAdmin";

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const admin = useAdmin();

  useEffect(() => {
    admin.initializeAdmin();
  }, [admin.initializeAdmin]);

  // Loading state
  if (admin.loading && !admin.stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-stone-600" />
          <p className="text-stone-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Admin Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-stone-800 mb-2">Admin Dashboard</h1>
          <p className="text-stone-600">Manage NetFast platform and monitor user activities</p>
        </div>

        {/* System Health Alert */}
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            System Status: <strong>Operational</strong> • Uptime: {admin.stats?.systemHealth || 0}% • All services running normally
          </AlertDescription>
        </Alert>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-600 text-sm">Total Users</p>
                  <p className="text-3xl font-light text-stone-800">{admin.stats?.totalUsers.toLocaleString() || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-600 text-sm">Active Subscriptions</p>
                  <p className="text-3xl font-light text-stone-800">{admin.stats?.activeSubscriptions.toLocaleString() || 0}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-600 text-sm">Devices Online</p>
                  <p className="text-3xl font-light text-stone-800">{admin.stats?.devicesOnline.toLocaleString() || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-600 text-sm">Violations Today</p>
                  <p className="text-3xl font-light text-stone-800">{admin.stats?.violationsToday || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              Users
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Shield size={16} />
              Devices
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <CreditCard size={16} />
              Billing
            </TabsTrigger>
            <TabsTrigger value="violations" className="flex items-center gap-2">
              <AlertTriangle size={16} />
              Violations
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminAnalytics stats={admin.stats} analytics={admin.analytics} />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers 
              users={admin.users} 
              pagination={admin.userPagination}
              onFetchUsers={admin.fetchUsers}
              onUpdateUserStatus={admin.updateUserStatus}
              loading={admin.loading}
            />
          </TabsContent>

          <TabsContent value="devices">
            <AdminDevices 
              devices={admin.devices} 
              pagination={admin.devicePagination}
              onFetchDevices={admin.fetchDevices}
              onForceSync={admin.forceDeviceSync}
              onDisconnect={admin.disconnectDevice}
              loading={admin.loading}
            />
          </TabsContent>

          <TabsContent value="subscriptions">
            <AdminSubscriptions 
              subscriptions={admin.subscriptions} 
              pagination={admin.subscriptionPagination}
              onFetchSubscriptions={admin.fetchSubscriptions}
              loading={admin.loading}
            />
          </TabsContent>

          <TabsContent value="violations">
            <AdminViolations 
              violations={admin.violations} 
              pagination={admin.violationPagination}
              onFetchViolations={admin.fetchViolations}
              loading={admin.loading}
            />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings 
              settings={admin.settings}
              systemInfo={admin.systemInfo}
              onUpdateSettings={admin.updateSettings}
              loading={admin.loading}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
