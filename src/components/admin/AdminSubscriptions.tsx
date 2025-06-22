
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";

const AdminSubscriptions = () => {
  // Mock subscription data
  const subscriptions = [
    { id: 1, userId: 1, email: 'john@example.com', tier: 'Digital Seeker', amount: 19, status: 'Active', nextBilling: '2024-07-22', method: 'Visa ***4242' },
    { id: 2, userId: 2, email: 'sarah@example.com', tier: 'Spiritual Practitioner', amount: 39, status: 'Active', nextBilling: '2024-07-15', method: 'MC ***8888' },
    { id: 3, userId: 3, email: 'mike@example.com', tier: 'Digital Master', amount: 79, status: 'Cancelled', nextBilling: '2024-06-30', method: 'Visa ***1234' },
    { id: 4, userId: 4, email: 'emma@example.com', tier: 'Digital Seeker', amount: 19, status: 'Past Due', nextBilling: '2024-06-20', method: 'PayPal' },
  ];

  const revenueStats = {
    totalRevenue: 15680,
    monthlyRecurring: 12450,
    churnRate: 3.2,
    newSubscriptions: 24
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Past Due':
        return <Badge className="bg-red-100 text-red-800">Past Due</Badge>;
      case 'Cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      'Digital Seeker': 'bg-blue-100 text-blue-800',
      'Spiritual Practitioner': 'bg-purple-100 text-purple-800',
      'Digital Master': 'bg-amber-100 text-amber-800'
    };
    return <Badge className={colors[tier as keyof typeof colors]}>{tier}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-light text-stone-800">${revenueStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">Monthly Recurring</p>
                <p className="text-2xl font-light text-stone-800">${revenueStats.monthlyRecurring.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">Churn Rate</p>
                <p className="text-2xl font-light text-stone-800">{revenueStats.churnRate}%</p>
              </div>
              <CreditCard className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">New This Month</p>
                <p className="text-2xl font-light text-stone-800">{revenueStats.newSubscriptions}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light text-stone-700">Subscription Management</CardTitle>
          <p className="text-stone-600">Monitor billing and subscription status</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Subscription Tier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">User #{subscription.userId}</div>
                      <div className="text-sm text-stone-500">{subscription.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(subscription.tier)}</TableCell>
                  <TableCell>${subscription.amount}/month</TableCell>
                  <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                  <TableCell>{subscription.nextBilling}</TableCell>
                  <TableCell>{subscription.method}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;
