
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { UserRound, Award, Compass, MapPin, Calendar, Settings, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="p-4 space-y-8">
        {/* Profile Header with gradient background */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 to-accent/40">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 border-4 border-white">
              <UserRound className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold mt-3">Välkommen!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Logga in för att se din profil
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-secondary/10 border-none shadow-sm">
            <div className="flex flex-col items-center">
              <Compass className="h-8 w-8 text-secondary mb-2" />
              <h3 className="font-semibold">0</h3>
              <p className="text-xs text-muted-foreground">Tävlingar</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-primary/10 border-none shadow-sm">
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">0</h3>
              <p className="text-xs text-muted-foreground">Resultat</p>
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="overflow-hidden border-none shadow-sm divide-y">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary w-5 h-5" />
              <div>
                <h3 className="font-medium">Klubb</h3>
                <p className="text-sm text-muted-foreground">
                  Din klubbtillhörighet
                </p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="text-primary w-5 h-5" />
              <div>
                <h3 className="font-medium">Kommande tävlingar</h3>
                <p className="text-sm text-muted-foreground">
                  Se dina anmälningar
                </p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="text-primary w-5 h-5" />
              <div>
                <h3 className="font-medium">Inställningar</h3>
                <p className="text-sm text-muted-foreground">
                  Anpassa din upplevelse
                </p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </div>
        </Card>
        
        {/* About text */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Orientera.com är en tjänst för orienterare i Sverige</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>

        {/* Login Button */}
        <div className="fixed bottom-24 inset-x-0 px-4">
          <Button 
            variant="default" 
            className="w-full py-6 text-lg font-medium shadow-md"
            onClick={() => setShowWaitlistDialog(true)}
          >
            Logga in
          </Button>
        </div>
      </div>
      
      {/* Waitlist Dialog */}
      <LoginWaitlistDialog 
        isOpen={showWaitlistDialog} 
        onClose={() => setShowWaitlistDialog(false)} 
      />
    </MobileLayout>
  );
};

export default ProfilePage;
