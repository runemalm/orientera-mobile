
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { UserRound, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProfilePage: React.FC = () => {
  return (
    <MobileLayout title="Profil">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserRound className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        </div>

        {/* Profile Info */}
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Namn</div>
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Klubb</div>
            <Skeleton className="h-4 w-1/2" />
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">SI-bricka</div>
            <Skeleton className="h-4 w-24" />
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Settings className="text-primary w-5 h-5" />
            <div>
              <h3 className="font-medium">Inställningar</h3>
              <p className="text-sm text-muted-foreground">
                Anpassa din profil
              </p>
            </div>
          </div>
        </Card>

        {/* Login Button */}
        <div className="fixed bottom-24 inset-x-0 px-4">
          <Button 
            variant="default" 
            className="w-full py-6 text-lg font-medium"
          >
            Logga in
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
