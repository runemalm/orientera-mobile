
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { UserRound, Award, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center ring-4 ring-primary/10">
                  <UserRound className="w-10 h-10 text-primary/80" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 space-y-2">
              <Award className="h-5 w-5 text-primary/60" />
              <Skeleton className="h-4 w-16 mt-2" />
              <Skeleton className="h-6 w-8" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 space-y-2">
              <CalendarRange className="h-5 w-5 text-primary/60" />
              <Skeleton className="h-4 w-16 mt-2" />
              <Skeleton className="h-6 w-8" />
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <Button 
              variant="default" 
              size="lg"
              className="w-full py-6 text-base font-medium"
              onClick={() => setShowWaitlistDialog(true)}
            >
              Logga in
            </Button>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="border-0 bg-secondary/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground text-center">Om Orientera.com</h3>
              <Separator className="bg-primary/5" />
              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>Orientera.com är en tjänst för orienterare i Sverige</p>
                <p>Version 1.0.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <LoginWaitlistDialog 
        isOpen={showWaitlistDialog} 
        onClose={() => setShowWaitlistDialog(false)} 
      />
    </MobileLayout>
  );
};

export default ProfilePage;
