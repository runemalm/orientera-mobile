
import React, { useState } from 'react';
import { UserRound, MessageSquare, Calendar, Star, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MobileLayout from '../components/layout/MobileLayout';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <MobileLayout title="Profil">
      {/* Main container with consistent padding and spacing */}
      <div className="flex flex-col items-center justify-start p-4 space-y-6">
        {/* Profile section with avatar */}
        <Card className="w-full border-none shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center pt-6 space-y-4">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
                <UserRound className="w-10 h-10 text-primary/70" />
              </div>
              <div className="absolute -bottom-1 right-0">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary/70" />
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-medium text-foreground">Välkommen</h2>
              <p className="text-sm text-muted-foreground">
                Skapa ett konto för att komma igång
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats cards using the same card style as other pages */}
        <div className="w-full grid gap-4">
          <Card className="overflow-hidden">
            <CardHeader className="p-4 pb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Dina aktiviteter</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 divide-x divide-border">
                <div className="p-4 text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-primary/70" />
                  <Skeleton className="h-4 w-8 mx-auto" />
                  <div className="text-xs text-muted-foreground mt-1">Tävlingar</div>
                </div>
                <div className="p-4 text-center">
                  <Star className="w-5 h-5 mx-auto mb-1 text-primary/70" />
                  <Skeleton className="h-4 w-8 mx-auto" />
                  <div className="text-xs text-muted-foreground mt-1">Favoriter</div>
                </div>
                <div className="p-4 text-center">
                  <MessageSquare className="w-5 h-5 mx-auto mb-1 text-primary/70" />
                  <Skeleton className="h-4 w-8 mx-auto" />
                  <div className="text-xs text-muted-foreground mt-1">Chattar</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login button with consistent styling */}
        <div className="w-full pt-2">
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setShowLoginDialog(true)}
          >
            Logga in med Eventor
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-4 px-6">
            Med ett Eventor-konto får du tillgång till alla funktioner och kan hantera dina tävlingar
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
