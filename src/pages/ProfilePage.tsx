
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MobileLayout from '../components/layout/MobileLayout';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="flex flex-col p-4 space-y-6">
        {/* Main profile card with skeleton */}
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        {/* Stats card */}
        <Card className="w-full">
          <CardContent className="py-6 px-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 text-center">
                <Skeleton className="h-10 w-16 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
              <div className="space-y-2 text-center">
                <Skeleton className="h-10 w-16 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
              <div className="space-y-2 text-center">
                <Skeleton className="h-10 w-16 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login button */}
        <div className="flex justify-center">
          <Button 
            className="shadow-lg px-8" 
            size="lg"
            onClick={() => setShowLoginDialog(true)}
          >
            Logga in med Eventor
          </Button>
        </div>
      </div>

      <LoginWaitlistDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
      />
    </MobileLayout>
  );
};

export default ProfilePage;
