
import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MobileLayout from '../components/layout/MobileLayout';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="flex flex-col items-center p-4 space-y-4">
        {/* Compact profile header */}
        <Card className="w-full border-none shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center pt-6 space-y-4">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
              <UserRound className="w-8 h-8 text-primary/70" />
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-medium text-foreground">Välkommen</h2>
            </div>
          </CardContent>
        </Card>

        {/* Simplified stats card */}
        <Card className="w-full overflow-hidden">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>

        {/* Login button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => setShowLoginDialog(true)}
        >
          Logga in med Eventor
        </Button>
      </div>

      <LoginWaitlistDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
      />
    </MobileLayout>
  );
};

export default ProfilePage;
