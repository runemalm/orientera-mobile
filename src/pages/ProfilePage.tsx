
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="p-4 space-y-4">
        {/* Profile Header with Skeleton */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-primary/10 to-accent/20 rounded-lg">
          <div className="relative">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
              <UserRound className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Skeleton Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-secondary/5 rounded-lg space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-8" />
          </div>
          <div className="p-3 bg-primary/5 rounded-lg space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-8" />
          </div>
        </div>

        {/* Login Button */}
        <div className="pt-4">
          <Button 
            variant="default" 
            className="w-full py-6 text-base font-medium shadow-sm"
            onClick={() => setShowWaitlistDialog(true)}
          >
            Logga in
          </Button>
        </div>

        {/* About Text */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>Orientera.com är en tjänst för orienterare i Sverige</p>
          <p className="mt-0.5">Version 1.0.0</p>
        </div>
      </div>
      
      <LoginWaitlistDialog 
        isOpen={showWaitlistDialog} 
        onClose={() => setShowWaitlistDialog(false)} 
      />
    </MobileLayout>
  );
};

export default ProfilePage;
