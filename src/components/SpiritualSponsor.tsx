
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heart, Mail, Phone, User, Plus, Trash2 } from "lucide-react";
import { useAccountability } from "@/hooks/useAccountability";
import { useToast } from "@/hooks/use-toast";

const SpiritualSponsor = () => {
  const { sponsor, setSpiritualSponsor, removeSponsor } = useAccountability();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and email for your spiritual sponsor.",
        variant: "destructive"
      });
      return;
    }

    setSpiritualSponsor({
      ...formData,
      isActive: true
    });

    toast({
      title: "Spiritual Sponsor Added",
      description: `${formData.name} is now your accountability partner on this sacred journey.`,
    });

    setFormData({ name: '', email: '', phone: '', relationship: '' });
    setIsAdding(false);
  };

  const handleRemove = () => {
    removeSponsor();
    toast({
      title: "Sponsor Removed",
      description: "Your spiritual sponsor has been removed from your account.",
    });
  };

  if (sponsor && !isAdding) {
    return (
      <Card className="border-stone-200/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-800">
            <Heart className="w-5 h-5 text-rose-500" />
            Spiritual Sponsor
          </CardTitle>
          <CardDescription>
            Your accountability partner in digital discipline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-stone-600" />
                <span className="font-medium text-stone-800">{sponsor.name}</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
              {sponsor.relationship && (
                <p className="text-sm text-stone-600">{sponsor.relationship}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-600" />
              <span className="text-sm text-stone-700">{sponsor.email}</span>
            </div>
            {sponsor.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-600" />
                <span className="text-sm text-stone-700">{sponsor.phone}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAdding(true)}
              className="flex-1"
            >
              Change Sponsor
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-stone-200/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-stone-800">
          <Heart className="w-5 h-5 text-rose-500" />
          Spiritual Sponsor
        </CardTitle>
        <CardDescription>
          Invite someone to support your digital discipline journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isAdding ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-600 mb-4">
              Having an accountability partner strengthens your commitment and provides support during challenging moments.
            </p>
            <Button onClick={() => setIsAdding(true)} className="bg-rose-500 hover:bg-rose-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Spiritual Sponsor
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Their full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="their.email@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Their phone number"
              />
            </div>

            <div>
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                placeholder="e.g., Friend, Mentor, Family Member"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Sponsor
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setFormData({ name: '', email: '', phone: '', relationship: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default SpiritualSponsor;
