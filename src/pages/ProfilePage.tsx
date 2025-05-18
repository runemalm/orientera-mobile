
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, MapPin, Trophy, Clock, Settings, ExternalLink, Heart } from 'lucide-react';
import SkeletonProfile from '@/components/profile/SkeletonProfile';
import LoginWaitlistDialog from '@/components/profile/LoginWaitlistDialog';
import ProfileSettings from '@/components/profile/ProfileSettings';

const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Mock user data - in a real app, this would come from authentication
  const userData = {
    name: "Anna Karlsson",
    email: "anna.karlsson@gmail.com",
    club: "Orienteringsklubben Linné",
    preferredClass: "d21",
    profileImage: "/placeholder.svg",
    joinedDate: "Mars 2024",
    stats: {
      competitions: 12,
      distance: "148 km"
    }
  };

  const handleLoginWithEventor = () => {
    setIsLoading(true);
    // Simulera inloggning
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSaveSettings = (updatedData: any) => {
    console.log("Sparar inställningar:", updatedData);
    setShowSettings(false);
  };

  return (
    <MobileLayout 
      title="Profil"
      action={isLoggedIn ? (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowSettings(true)}
          className="text-primary"
        >
          <Settings className="h-5 w-5" />
        </Button>
      ) : undefined}
    >
      <div className="px-4 pt-2 pb-20 space-y-5">
        {isLoading ? (
          <SkeletonProfile />
        ) : showSettings ? (
          <ProfileSettings 
            userData={userData}
            onSave={handleSaveSettings}
            onCancel={() => setShowSettings(false)}
          />
        ) : isLoggedIn ? (
          <>
            {/* Profile Card */}
            <Card className="w-full border-primary/20">
              <CardHeader className="pb-2 flex justify-between items-center">
                <h2 className="text-lg font-medium text-center mx-auto">Min profil</h2>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                    <User className="h-12 w-12 text-primary/70" />
                  </div>
                  
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-semibold">{userData.name}</h3>
                    <p className="text-muted-foreground">{userData.club}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Medlem sedan {userData.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Features Card */}
            <Card className="w-full">
              <CardHeader className="pb-2">
                <h2 className="text-lg font-medium">Tävlingar och resultat</h2>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* Feature Item 1 */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mina tävlingar</h3>
                      <p className="text-sm text-muted-foreground">Se dina anmälda och kommande tävlingar</p>
                    </div>
                  </div>
                  
                  {/* Feature Item 2 */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mina resultat</h3>
                      <p className="text-sm text-muted-foreground">Kolla dina tidigare resultat och statistik</p>
                    </div>
                  </div>
                  
                  {/* Feature Item 3 */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mina starttider</h3>
                      <p className="text-sm text-muted-foreground">Se dina kommande starttider</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Card */}
            <Card className="w-full bg-primary/5 border-primary/10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-center font-medium">Din statistik</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userData.stats.competitions}</p>
                      <p className="text-sm text-muted-foreground">Tävlingar</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userData.stats.distance}</p>
                      <p className="text-sm text-muted-foreground">Total sträcka</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Club Account Link */}
            <Card className="w-full overflow-hidden">
              <CardContent className="p-0">
                <Button 
                  variant="link" 
                  className="w-full h-auto p-4 justify-between items-center flex"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Klubbkonto</h3>
                      <p className="text-sm text-muted-foreground">Hantera klubbinställningar</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Card className="w-full">
              <CardContent className="p-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleLogout}
                >
                  Logga ut
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Not logged in state */
          <div className="flex flex-col items-center justify-center py-8 space-y-8">
            <Card className="w-full border-primary/20">
              <CardContent className="p-8 flex flex-col items-center space-y-6">
                <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary/40" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">Logga in med Eventor</h2>
                  <p className="text-muted-foreground">
                    Logga in med ditt Eventor-konto för att se dina tävlingar, resultat och mycket mer.
                  </p>
                </div>
                <Button onClick={handleLoginWithEventor} className="w-full">
                  Logga in med Eventor
                </Button>
              </CardContent>
            </Card>
            
            <Card className="w-full">
              <CardHeader className="pb-2">
                <h2 className="text-lg font-medium">Funktioner för inloggade</h2>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-3 opacity-60">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mina tävlingar</h3>
                      <p className="text-sm text-muted-foreground">Se dina anmälda och kommande tävlingar</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-3 opacity-60">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mina resultat</h3>
                      <p className="text-sm text-muted-foreground">Kolla dina tidigare resultat och statistik</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-3 opacity-60">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mina favoriter</h3>
                      <p className="text-sm text-muted-foreground">Spara och organisera dina favorittävlingar</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Login Waitlist Dialog - behålls för bakåtkompatibilitet */}
      <LoginWaitlistDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
      />
    </MobileLayout>
  );
};

export default ProfilePage;
