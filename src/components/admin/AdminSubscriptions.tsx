import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, CreditCard, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AdminSubscription } from "@/services/api";

interface AdminSubscriptionsProps {
  subscriptions: AdminSubscription[];
  pagination: { page: number; total: number; pages: number };
  onFetchSubscriptions: (page?: number, status?: string) => Promise<void>;
  loading: boolean;
}

const AdminSubscriptions: React.FC<AdminSubscriptionsProps> = ({ 
  subscriptions, 
  pagination, 
  onFetchSubscriptions, 
  loading 
}) => {
  const handlePageChange = (page: number) => {
    onFetchSubscriptions(page);
  };

  // Calculate revenue stats from subscriptions
  const revenueStats = {
    totalRevenue: subscriptions.reduce((total, sub) => total + (sub.amount || 0), 0),
    monthlyRecurring: subscriptions.filter(sub => sub.status === 'active').reduce((total, sub) => total + (sub.amount || 0), 0),
    churnRate: 3.2, // This would come from backend analytics
    newSubscriptions: subscriptions.filter(sub => {
      const createdDate = new Date(sub.createdAt);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return createdDate > thirtyDaysAgo;
    }).length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'past_due':
        return <Badge className="bg-red-100 text-red-800">Past Due</Badge>;
      case 'cancelled':
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-stone-600" />
            </div>
          ) : (
            <>
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
                    <TableRow key={subscription._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{subscription.userId.name}</div>
                          <div className="text-sm text-stone-500">{subscription.userId.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getTierBadge(subscription.tier)}</TableCell>
                      <TableCell>${subscription.amount}/month</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>{subscription.paymentMethod || 'N/A'}</TableCell>
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

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-stone-600">
                    Showing page {pagination.page} of {pagination.pages} ({pagination.total} total subscriptions)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;
