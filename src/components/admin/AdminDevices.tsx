import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldX, Monitor, Smartphone, Laptop, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AdminDevice } from "@/services/api";

interface AdminDevicesProps {
  devices: AdminDevice[];
  pagination: { page: number; total: number; pages: number };
  onFetchDevices: (page?: number, status?: string) => Promise<void>;
  onForceSync: (deviceId: string) => Promise<boolean>;
  onDisconnect: (deviceId: string) => Promise<boolean>;
  loading: boolean;
}

const AdminDevices: React.FC<AdminDevicesProps> = ({ 
  devices, 
  pagination, 
  onFetchDevices, 
  onForceSync, 
  onDisconnect, 
  loading 
}) => {
  const [syncingDevice, setSyncingDevice] = useState<string | null>(null);
  const [disconnectingDevice, setDisconnectingDevice] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    onFetchDevices(page);
  };

  const handleForceSync = async (deviceId: string) => {
    setSyncingDevice(deviceId);
    await onForceSync(deviceId);
    setSyncingDevice(null);
  };

  const handleDisconnect = async (deviceId: string) => {
    setDisconnectingDevice(deviceId);
    await onDisconnect(deviceId);
    setDisconnectingDevice(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'offline':
        return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDNSStatusBadge = (status: string) => {
    switch (status) {
      case 'protected':
        return <Badge className="bg-green-100 text-green-800"><Shield size={12} className="mr-1" />Protected</Badge>;
      case 'tampered':
        return <Badge className="bg-red-100 text-red-800"><ShieldX size={12} className="mr-1" />Tampered</Badge>;
      case 'bypassed':
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-stone-600" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>User</TableHead>
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
                  <TableRow key={device._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.deviceType)}
                        <div>
                          <div className="font-medium">{device.deviceName}</div>
                          <div className="text-sm text-stone-500 capitalize">{device.deviceType}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{device.userId.name}</div>
                        <div className="text-sm text-stone-500">{device.userId.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{device.platform}</TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                    <TableCell>{getDNSStatusBadge(device.dnsStatus)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(device.lastHeartbeat).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={device.violations > 10 ? "destructive" : device.violations > 5 ? "default" : "outline"}>
                        {device.violations}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600"
                          onClick={() => handleForceSync(device._id)}
                          disabled={syncingDevice === device._id}
                        >
                          {syncingDevice === device._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            'Force Sync'
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDisconnect(device._id)}
                          disabled={disconnectingDevice === device._id}
                        >
                          {disconnectingDevice === device._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            'Disconnect'
                          )}
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
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total devices)
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
  );
};

export default AdminDevices;
