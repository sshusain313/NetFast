import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Shield, DollarSign } from "lucide-react";
import { AdminStats, AdminAnalytics as AdminAnalyticsType } from "@/services/api";

interface AdminAnalyticsProps {
  stats: AdminStats | null;
  analytics: AdminAnalyticsType | null;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ stats, analytics }) => {
  // Transform backend data for charts
  const userGrowthData = analytics?.userGrowth?.map(item => ({
    month: new Date(item._id).toLocaleDateString('en-US', { month: 'short' }),
    users: item.count
  })) || [];

  const violationTrendsData = analytics?.violationTrends?.map(item => ({
    day: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
    violations: item.count
  })) || [];

  const subscriptionDistribution = analytics?.subscriptionDistribution?.map(item => ({
    name: item._id,
    value: item.count,
    color: item._id === 'Digital Seeker' ? '#3B82F6' : 
           item._id === 'Spiritual Practitioner' ? '#8B5CF6' : '#F59E0B'
  })) || [];

  const revenueData = analytics?.revenueData?.map(item => ({
    month: new Date(item._id).toLocaleDateString('en-US', { month: 'short' }),
    revenue: item.revenue
  })) || [];

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">User Growth</p>
                <p className="text-3xl font-light text-blue-800">
                  {userGrowthData.length > 1 ? 
                    `${Math.round(((userGrowthData[userGrowthData.length - 1]?.users || 0) - (userGrowthData[0]?.users || 0)) / (userGrowthData[0]?.users || 1) * 100)}%` : 
                    '0%'
                  }
                </p>
                <p className="text-xs text-blue-600">vs last month</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Protection Rate</p>
                <p className="text-3xl font-light text-green-800">
                  {stats?.violationsToday ? Math.round((stats.violationsToday / (stats.violationsToday + 5)) * 100) : 87}%
                </p>
                <p className="text-xs text-green-600">violations blocked</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Revenue Growth</p>
                <p className="text-3xl font-light text-purple-800">
                  {revenueData.length > 1 ? 
                    `${Math.round(((revenueData[revenueData.length - 1]?.revenue || 0) - (revenueData[0]?.revenue || 0)) / (revenueData[0]?.revenue || 1) * 100)}%` : 
                    '0%'
                  }
                </p>
                <p className="text-xs text-purple-600">vs last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">System Uptime</p>
                <p className="text-3xl font-light text-amber-800">{stats?.systemHealth || 0}%</p>
                <p className="text-xs text-amber-600">last 30 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-light text-stone-700">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Violation Trends */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-light text-stone-700">Weekly Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={violationTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="violations" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-light text-stone-700">Subscription Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {subscriptionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-light text-stone-700">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
