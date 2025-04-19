
import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileLayout from '../components/layout/MobileLayout';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="flex flex-col items-center justify-start p-4 space-y-6 pt-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <UserRound className="w-12 h-12 text-primary" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Välkommen till Orientera.com</h1>
          <p className="text-muted-foreground">
            Logga in med ditt Eventor-konto för att få tillgång till alla funktioner
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
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
