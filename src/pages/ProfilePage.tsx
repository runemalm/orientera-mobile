
import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import MobileLayout from '../components/layout/MobileLayout';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="flex flex-col items-center justify-start p-4 space-y-8 pt-8">
        <div className="relative">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <UserRound className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -bottom-1 right-0">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-lg">
              <UserRound className="w-4 h-4 text-secondary-foreground" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-2 w-full max-w-sm">
          <h1 className="text-2xl font-semibold">Välkommen till Orientera.com</h1>
          <p className="text-muted-foreground">
            Logga in för att se din profil och hantera dina tävlingar
          </p>
        </div>

        <div className="w-full max-w-sm space-y-6">
          {/* Skeleton UI elements to show locked content */}
          <div className="space-y-4 rounded-lg border p-4 bg-card">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="space-y-4 rounded-lg border p-4 bg-card">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[180px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setShowLoginDialog(true)}
          >
            Logga in med Eventor
          </Button>
          
          <p className="text-sm text-center text-muted-foreground px-6">
            Med ett Eventor-konto kan du anmäla dig till tävlingar, 
            se dina resultat och mycket mer.
          </p>
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
