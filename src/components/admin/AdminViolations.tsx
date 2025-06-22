
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'Medium':
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'Low':
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
                <p className="text-lg font-light text-stone-800">{violationStats.mostCommonType}</p>
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
                onClick={() => setTimeFilter('today')}
              >
                Today
              </Button>
              <Button 
                variant={timeFilter === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeFilter('week')}
              >
                This Week
              </Button>
              <Button 
                variant={timeFilter === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeFilter('month')}
              >
                This Month
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminViolations;
