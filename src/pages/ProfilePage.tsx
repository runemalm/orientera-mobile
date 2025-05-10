
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import MobileLayout from '../components/layout/MobileLayout';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';
import { LogIn } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Logga in för att fortsätta</h2>
            <p className="text-muted-foreground">
              Skapa ett konto för att få tillgång till din personliga profil och alla funktioner.
            </p>
          </div>
          
          <Button 
            className="w-full text-lg py-6 shadow-md bg-primary text-primary-foreground" 
            size="lg"
            variant="default"
            onClick={() => setShowLoginDialog(true)}
          >
            <LogIn className="mr-2" />
            Logga in
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
