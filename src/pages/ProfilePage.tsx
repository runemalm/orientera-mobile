
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MobileLayout from '../components/layout/MobileLayout';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';
import { UserRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SkeletonProfile from '../components/profile/SkeletonProfile';

const ProfilePage: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="flex flex-col items-center p-4 space-y-6 relative">
        {/* Skeleton UI */}
        <SkeletonProfile />
        
        {/* Login CTA Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserRound className="h-8 w-8 text-primary/60" />
            </div>
            <h2 className="text-xl font-semibold">Logga in för att fortsätta</h2>
            <p className="text-sm text-muted-foreground">
              Du behöver logga in för att se din profil och använda alla funktioner.
            </p>
            <Button 
              className="w-full shadow-sm"
              onClick={() => setShowLoginDialog(true)}
            >
              Gå med i väntelistan
            </Button>
          </div>
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
