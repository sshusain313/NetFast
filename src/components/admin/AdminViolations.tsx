<<<<<<< HEAD
=======

>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { AlertTriangle, Shield, Globe, Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AdminViolation } from "@/services/api";

interface AdminViolationsProps {
  violations: AdminViolation[];
  pagination: { page: number; total: number; pages: number };
  onFetchViolations: (page?: number, severity?: string, timeFilter?: string) => Promise<void>;
  loading: boolean;
}

const AdminViolations: React.FC<AdminViolationsProps> = ({ 
  violations, 
  pagination, 
  onFetchViolations, 
  loading 
}) => {
  const [timeFilter, setTimeFilter] = useState('today');

  const handleTimeFilterChange = (filter: string) => {
    setTimeFilter(filter);
    onFetchViolations(1, undefined, filter);
  };

  const handlePageChange = (page: number) => {
    onFetchViolations(page, undefined, timeFilter);
  };

  // Calculate violation stats from data
  const violationStats = {
    totalToday: violations.length,
    blockedToday: violations.filter(v => v.blocked).length,
    highSeverity: violations.filter(v => v.severity === 'high').length,
    mostCommonType: violations.length > 0 ? 
      violations.reduce((acc, v) => {
        acc[v.type] = (acc[v.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) : {}
=======
import { AlertTriangle, Shield, Globe, Clock } from "lucide-react";

const AdminViolations = () => {
  const [timeFilter, setTimeFilter] = useState('today');

  // Mock violation data
  const violations = [
    { id: 1, userId: 1, deviceId: 2, type: 'DNS Bypass', severity: 'High', timestamp: '2024-06-22 14:25:30', details: 'User attempted to change DNS settings', blocked: true },
    { id: 2, userId: 2, deviceId: 3, type: 'Restricted Site Access', severity: 'Medium', timestamp: '2024-06-22 13:45:12', details: 'Attempted access to social media during fast', blocked: true },
    { id: 3, userId: 3, deviceId: 4, type: 'App Bypass Attempt', severity: 'High', timestamp: '2024-06-22 12:30:45', details: 'Attempted to uninstall NetFast protection', blocked: false },
    { id: 4, userId: 1, deviceId: 1, type: 'VPN Detection', severity: 'Medium', timestamp: '2024-06-22 11:15:20', details: 'VPN usage detected, automatically disconnected', blocked: true },
    { id: 5, userId: 4, deviceId: 5, type: 'Time Violation', severity: 'Low', timestamp: '2024-06-22 10:30:15', details: 'Device usage outside allowed hours', blocked: true },
  ];

  const violationStats = {
    totalToday: 23,
    blockedToday: 20,
    highSeverity: 8,
    mostCommonType: 'DNS Bypass'
>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
<<<<<<< HEAD
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'low':
=======
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'Medium':
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'Low':
>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
        return <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getBlockedBadge = (blocked: boolean) => {
    return blocked ? 
      <Badge className="bg-green-100 text-green-800"><Shield size={12} className="mr-1" />Blocked</Badge> :
      <Badge className="bg-red-100 text-red-800"><AlertTriangle size={12} className="mr-1" />Bypassed</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Violation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">Total Today</p>
                <p className="text-2xl font-light text-stone-800">{violationStats.totalToday}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">Successfully Blocked</p>
                <p className="text-2xl font-light text-stone-800">{violationStats.blockedToday}</p>
              </div>
              <Shield className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">High Severity</p>
                <p className="text-2xl font-light text-stone-800">{violationStats.highSeverity}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">Most Common</p>
<<<<<<< HEAD
                <p className="text-lg font-light text-stone-800">
                  {Object.keys(violationStats.mostCommonType).length > 0 ? 
                    Object.entries(violationStats.mostCommonType).sort(([,a], [,b]) => b - a)[0][0] : 
                    'None'
                  }
                </p>
=======
                <p className="text-lg font-light text-stone-800">{violationStats.mostCommonType}</p>
>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
              </div>
              <Globe className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Violations Table */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-light text-stone-700">Violation Log</CardTitle>
              <p className="text-stone-600">Monitor and analyze security violations</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={timeFilter === 'today' ? 'default' : 'outline'} 
                size="sm"
<<<<<<< HEAD
                onClick={() => handleTimeFilterChange('today')}
=======
                onClick={() => setTimeFilter('today')}
>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
              >
                Today
              </Button>
              <Button 
                variant={timeFilter === 'week' ? 'default' : 'outline'} 
                size="sm"
<<<<<<< HEAD
                onClick={() => handleTimeFilterChange('week')}
=======
                onClick={() => setTimeFilter('week')}
>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
              >
                This Week
              </Button>
              <Button 
                variant={timeFilter === 'month' ? 'default' : 'outline'} 
                size="sm"
<<<<<<< HEAD
                onClick={() => handleTimeFilterChange('month')}
=======
                onClick={() => setTimeFilter('month')}
>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
              >
                This Month
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-stone-600" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User/Device</TableHead>
                    <TableHead>Violation Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation) => (
                    <TableRow key={violation._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{violation.userId.name}</div>
                          <div className="text-sm text-stone-500">{violation.deviceId.deviceName}</div>
                        </div>
                      </TableCell>
                      <TableCell>{violation.type}</TableCell>
                      <TableCell>{getSeverityBadge(violation.severity)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-stone-400" />
                          <span className="text-sm">{new Date(violation.timestamp).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getBlockedBadge(violation.blocked)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-stone-600">
                          {violation.details}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Take Action
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
                    Showing page {pagination.page} of {pagination.pages} ({pagination.total} total violations)
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
=======
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User/Device</TableHead>
                <TableHead>Violation Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {violations.map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">User #{violation.userId}</div>
                      <div className="text-sm text-stone-500">Device #{violation.deviceId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{violation.type}</TableCell>
                  <TableCell>{getSeverityBadge(violation.severity)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-stone-400" />
                      <span className="text-sm">{violation.timestamp}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getBlockedBadge(violation.blocked)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-stone-600">
                      {violation.details}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Take Action
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminViolations;
