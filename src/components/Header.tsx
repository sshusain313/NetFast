import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';
import ElectronStatus from './ElectronStatus';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getSubscriptionBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Digital Seeker':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Spiritual Practitioner':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Digital Master':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <header className="border-b border-stone-200/50 bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🧘</span>
            </div>
            <div>
              <h1 className="text-2xl font-light text-stone-800">NetFast</h1>
              <p className="text-xs text-stone-500">Digital Discipline • Spiritual Clarity</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <ElectronStatus />
            
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              Protected
            </Badge>
            
            {isAuthenticated && user && (
              <Badge variant="outline" className={getSubscriptionBadgeColor(user.subscription_tier)}>
                {user.subscription_tier}
              </Badge>
            )}
            
            <Link to="/settings">
              <Button 
                variant="ghost" 
                className={`text-stone-600 hover:text-stone-800 ${location.pathname === '/settings' ? 'bg-stone-100' : ''}`}
              >
                Settings
              </Button>
            </Link>
            
            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.subscription_tier}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
