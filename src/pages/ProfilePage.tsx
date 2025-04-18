
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
      <div className="p-3 space-y-4">
        {/* Compact Profile Header */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-accent/30">
          <div className="relative flex items-center justify-center py-6 px-3">
            <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-2 border-2 border-white">
              <UserRound className="w-8 h-8 text-primary" />
            </div>
            <div className="ml-4 text-left">
              <h2 className="text-lg font-semibold">Välkommen!</h2>
              <p className="text-xs text-muted-foreground">
                Logga in för att se din profil
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-secondary/10 border-none shadow-sm">
            <div className="flex items-center space-x-3">
              <Compass className="h-6 w-6 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Tävlingar</p>
                <p className="font-semibold">0</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-primary/10 border-none shadow-sm">
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Resultat</p>
                <p className="font-semibold">0</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="overflow-hidden border-none shadow-sm divide-y">
          {[
            {
              icon: <MapPin className="text-primary w-4 h-4" />,
              title: "Klubb",
              subtitle: "Din klubbtillhörighet"
            },
            {
              icon: <Calendar className="text-primary w-4 h-4" />,
              title: "Kommande tävlingar",
              subtitle: "Se dina anmälningar"
            },
            {
              icon: <Settings className="text-primary w-4 h-4" />,
              title: "Inställningar",
              subtitle: "Anpassa din upplevelse"
            }
          ].map((item, index) => (
            <div key={index} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-muted-foreground w-4 h-4" />
            </div>
          ))}
        </Card>
        
        {/* About text */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Orientera.com är en tjänst för orienterare i Sverige</p>
          <p className="mt-0.5">Version 1.0.0</p>
        </div>

        {/* Login Button */}
        <div className="fixed bottom-20 inset-x-0 px-3">
          <Button 
            variant="default" 
            className="w-full py-4 text-base font-medium shadow-md"
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
