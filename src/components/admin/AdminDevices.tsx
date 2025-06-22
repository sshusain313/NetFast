
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldX, Monitor, Smartphone, Laptop } from "lucide-react";

const AdminDevices = () => {
  // Mock device data
  const devices = [
    { id: 1, userId: 1, deviceName: 'John\'s Laptop', type: 'desktop', os: 'Windows 11', status: 'Online', dnsStatus: 'Protected', lastHeartbeat: '2024-06-22 14:30', violations: 0 },
    { id: 2, userId: 1, deviceName: 'John\'s Phone', type: 'mobile', os: 'iOS 17', status: 'Online', dnsStatus: 'Protected', lastHeartbeat: '2024-06-22 14:28', violations: 2 },
    { id: 3, userId: 2, deviceName: 'Sarah\'s Desktop', type: 'desktop', os: 'macOS 14', status: 'Offline', dnsStatus: 'Tampered', lastHeartbeat: '2024-06-21 09:15', violations: 8 },
    { id: 4, userId: 3, deviceName: 'Mike\'s Work PC', type: 'desktop', os: 'Windows 10', status: 'Online', dnsStatus: 'Bypassed', lastHeartbeat: '2024-06-22 14:25', violations: 15 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Online':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'Offline':
        return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDNSStatusBadge = (status: string) => {
    switch (status) {
      case 'Protected':
        return <Badge className="bg-green-100 text-green-800"><Shield size={12} className="mr-1" />Protected</Badge>;
      case 'Tampered':
        return <Badge className="bg-red-100 text-red-800"><ShieldX size={12} className="mr-1" />Tampered</Badge>;
      case 'Bypassed':
        return <Badge className="bg-orange-100 text-orange-800"><ShieldX size={12} className="mr-1" />Bypassed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return <Monitor size={16} />;
      case 'mobile':
        return <Smartphone size={16} />;
      case 'laptop':
        return <Laptop size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-light text-stone-700">Device Management</CardTitle>
        <p className="text-stone-600">Monitor and control device DNS protection status</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Operating System</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>DNS Protection</TableHead>
              <TableHead>Last Heartbeat</TableHead>
              <TableHead>Violations</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device.type)}
                    <div>
                      <div className="font-medium">{device.deviceName}</div>
                      <div className="text-sm text-stone-500 capitalize">{device.type}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>#{device.userId}</TableCell>
                <TableCell>{device.os}</TableCell>
                <TableCell>{getStatusBadge(device.status)}</TableCell>
                <TableCell>{getDNSStatusBadge(device.dnsStatus)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {device.lastHeartbeat}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={device.violations > 10 ? "destructive" : device.violations > 5 ? "default" : "outline"}>
                    {device.violations}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      Force Sync
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Disconnect
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminDevices;
