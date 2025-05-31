
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

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
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Protected
            </Badge>
            <Link to="/settings">
              <Button 
                variant="ghost" 
                className={`text-stone-600 hover:text-stone-800 ${location.pathname === '/settings' ? 'bg-stone-100' : ''}`}
              >
                Settings
              </Button>
            </Link>
            <Link to="/account">
              <Button 
                variant="ghost" 
                className={`text-stone-600 hover:text-stone-800 ${location.pathname === '/account' ? 'bg-stone-100' : ''}`}
              >
                Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
