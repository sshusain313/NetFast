
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Shield, CreditCard, LogOut } from "lucide-react";
import Header from "@/components/Header";

const Account = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30">
      <Header />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-800 mb-2">Account</h1>
          <p className="text-stone-600">Manage your spiritual journey profile</p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="border-stone-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-800">
                <User className="w-5 h-5 text-amber-600" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your personal details for the NetFast journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-amber-100 text-amber-700 text-lg">🧘</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-stone-800">Spiritual Seeker</h3>
                  <p className="text-sm text-stone-500">On the path to digital mindfulness</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Spiritual Seeker" className="border-stone-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="seeker@example.com" className="border-stone-200" />
                </div>
              </div>

              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Details */}
          <Card className="border-stone-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-800">
                <CreditCard className="w-5 h-5 text-amber-600" />
                Subscription Details
              </CardTitle>
              <CardDescription>
                Your current commitment to digital discipline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-700 font-semibold">40</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-800">Digital Monk</h3>
                    <p className="text-sm text-stone-500">40-day spiritual discipline</p>
                  </div>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-stone-600">Started</Label>
                  <p className="text-sm font-medium text-stone-800">March 15, 2024</p>
                </div>
                <div>
                  <Label className="text-sm text-stone-600">Ends</Label>
                  <p className="text-sm font-medium text-stone-800">April 24, 2024</p>
                </div>
                <div>
                  <Label className="text-sm text-stone-600">Progress</Label>
                  <p className="text-sm font-medium text-stone-800">8 / 40 days</p>
                </div>
                <div>
                  <Label className="text-sm text-stone-600">Status</Label>
                  <p className="text-sm font-medium text-green-700">On Track</p>
                </div>
              </div>

              <div className="w-full bg-stone-200 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="border-stone-200 hover:bg-stone-50">
                  Extend Journey
                </Button>
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                  Cancel (Requires Reflection)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Journey Statistics */}
          <Card className="border-stone-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-800">
                <Calendar className="w-5 h-5 text-amber-600" />
                Your Journey
              </CardTitle>
              <CardDescription>
                Celebrate your progress toward digital freedom
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-light text-amber-700 mb-1">8</div>
                  <div className="text-xs text-stone-600">Days Completed</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-light text-green-700 mb-1">156</div>
                  <div className="text-xs text-stone-600">Sites Blocked</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-light text-blue-700 mb-1">12h</div>
                  <div className="text-xs text-stone-600">Time Saved</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-stone-600">Recent Milestones</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-stone-700">Completed first week of digital discipline</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-stone-700">Successfully resisted 12 distraction attempts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-stone-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-800">
                <Shield className="w-5 h-5 text-amber-600" />
                Account Security
              </CardTitle>
              <CardDescription>
                Protect your spiritual journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full border-stone-200 hover:bg-stone-50">
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full border-stone-200 hover:bg-stone-50">
                Download Journey Data
              </Button>

              <Separator />

              <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;
