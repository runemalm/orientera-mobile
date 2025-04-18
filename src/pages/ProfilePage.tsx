
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="p-4 space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                <UserRound className="w-8 h-8 text-primary/60" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          variant="default" 
          size="lg"
          className="w-full"
          onClick={() => setShowWaitlistDialog(true)}
        >
          Logga in
        </Button>
      </div>
      
      <LoginWaitlistDialog 
        isOpen={showWaitlistDialog} 
        onClose={() => setShowWaitlistDialog(false)} 
      />
    </MobileLayout>
  );
};

export default ProfilePage;
