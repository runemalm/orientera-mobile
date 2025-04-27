
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MobileLayout from '../components/layout/MobileLayout';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';
import { CalendarCheck, Trophy, Clock, UserRound } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      <div className="flex flex-col items-center p-4 space-y-6">
        {/* Profile Preview Card */}
        <Card className="w-full border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
              <UserRound className="h-5 w-5 text-primary" />
              Kommande funktion
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UserRound className="h-10 w-10 text-primary/40" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-medium text-lg">Din orienteringsprofil</h3>
                <p className="text-muted-foreground text-sm">
                  Snart kommer du kunna logga in för att hantera dina tävlingar, resultat och mer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kommande funktioner</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <CalendarCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Personlig tävlingskalender</h4>
                  <p className="text-muted-foreground text-sm">Se och hantera dina kommande tävlingar på ett ställe.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Resultat och statistik</h4>
                  <p className="text-muted-foreground text-sm">Följ dina resultat och få personliga statistikinsikter.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Starttidspåminnelser</h4>
                  <p className="text-muted-foreground text-sm">Få påminnelser om dina kommande tävlingsstarter.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Get Early Access Card */}
        <Card className="w-full bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-lg">Få tidig tillgång</h3>
              <p className="text-sm text-muted-foreground">
                Vi håller på att bygga profil-funktionen. Gå med i väntelistan för att få tidig tillgång när den lanseras.
              </p>
              <Button 
                className="w-full shadow-sm"
                onClick={() => setShowLoginDialog(true)}
              >
                Gå med i väntelistan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <LoginWaitlistDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
      />
    </MobileLayout>
  );
};

export default ProfilePage;
