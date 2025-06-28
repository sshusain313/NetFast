<<<<<<< HEAD
=======

>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { Search, UserX, Mail, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AdminUser } from "@/services/api";

interface AdminUsersProps {
  users: AdminUser[];
  pagination: { page: number; total: number; pages: number };
  onFetchUsers: (page?: number, search?: string) => Promise<void>;
  onUpdateUserStatus: (userId: string, status: 'active' | 'suspended') => Promise<boolean>;
  loading: boolean;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ 
  users, 
  pagination, 
  onFetchUsers, 
  onUpdateUserStatus, 
  loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleSearch = () => {
    onFetchUsers(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    onFetchUsers(page, searchTerm);
  };

  const handleStatusUpdate = async (userId: string, status: 'active' | 'suspended') => {
    setUpdatingStatus(userId);
    await onUpdateUserStatus(userId, status);
    setUpdatingStatus(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
=======
import { Search, UserX, Mail, Eye } from "lucide-react";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data
  const users = [
    { id: 1, email: 'john@example.com', name: 'John Smith', tier: 'Digital Seeker', status: 'Active', devices: 2, lastSeen: '2024-06-20', violations: 0 },
    { id: 2, email: 'sarah@example.com', name: 'Sarah Johnson', tier: 'Spiritual Practitioner', status: 'Active', devices: 1, lastSeen: '2024-06-21', violations: 3 },
    { id: 3, email: 'mike@example.com', name: 'Mike Wilson', tier: 'Digital Master', status: 'Suspended', devices: 3, lastSeen: '2024-06-19', violations: 12 },
    { id: 4, email: 'emma@example.com', name: 'Emma Davis', tier: 'Digital Seeker', status: 'Active', devices: 1, lastSeen: '2024-06-22', violations: 1 },
  ];

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Suspended':
>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
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
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-light text-stone-700">User Management</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-stone-200 rounded-lg bg-white/50 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
=======
              />
            </div>
>>>>>>> 5fe0644349028d90f27b9c730084dfcffe6c8030
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
                  <TableHead>User</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Violations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-stone-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTierBadge(user.subscription_tier)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.devices}</TableCell>
                    <TableCell>
                      {user.lastSeen ? new Date(user.lastSeen).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.violations > 5 ? "destructive" : "outline"}>
                        {user.violations}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleStatusUpdate(
                            user._id, 
                            user.status === 'active' ? 'suspended' : 'active'
                          )}
                          disabled={updatingStatus === user._id}
                        >
                          {updatingStatus === user._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <UserX size={16} />
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
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total users)
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
              <TableHead>User</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Devices</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead>Violations</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-stone-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{getTierBadge(user.tier)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.devices}</TableCell>
                <TableCell>{user.lastSeen}</TableCell>
                <TableCell>
                  <Badge variant={user.violations > 5 ? "destructive" : "outline"}>
                    {user.violations}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <UserX size={16} />
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
  );
};

export default AdminUsers;
