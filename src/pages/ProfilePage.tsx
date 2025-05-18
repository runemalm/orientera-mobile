import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, MapPin, Trophy, Clock, Settings, ExternalLink, Heart } from 'lucide-react';
import SkeletonProfile from '@/components/profile/SkeletonProfile';
import LoginWaitlistDialog from '@/components/profile/LoginWaitlistDialog';
import ProfileSettings from '@/components/profile/ProfileSettings';
import LinkListItem from '@/components/competition/LinkListItem';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CompetitionSummary, Discipline, CompetitionType, OrienteeringDistrict, Branch } from '@/types';
import { getCompetitionsByIds } from '@/services/api';

const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<CompetitionSummary[]>([]);
  const [previousResults, setPreviousResults] = useState<any[]>([]);
  
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

  // Mock data for upcoming competitions - updating to match CompetitionSummary type
  const mockUpcomingCompetitions: CompetitionSummary[] = [
    {
      id: "8f935fac-bcdf-4f8d-82de-d7c48348aa41",
      name: "Hellas KM, medel",
      date: "2025-05-20",
      location: "Hellasgården",
      club: "Hellas Orientering",
      description: "Klubbmästerskap medeldistans",
      discipline: Discipline.Middle,
      competitionType: CompetitionType.Club,
      district: OrienteeringDistrict.Stockholm,
      branch: Branch.FootO,
      latitude: 59.2856,
      longitude: 18.1627
    },
    {
      id: "mock-id-2",
      name: "Sommarsprinten",
      date: "2025-06-15",
      location: "Södermalm",
      club: "Stockholms OK",
      description: "Sommarsprinten i stadsområde",
      discipline: Discipline.Sprint,
      competitionType: CompetitionType.Regional,
      district: OrienteeringDistrict.Stockholm,
      branch: Branch.FootO,
      latitude: 59.3127,
      longitude: 18.0649
    }
  ];
  
  // Store start times in a separate object using competition ID as key
  const competitionStartTimes: Record<string, string | null> = {
    "8f935fac-bcdf-4f8d-82de-d7c48348aa41": "10:30",
    "mock-id-2": null
  };
  
  // Mock data for previous results
  const mockPreviousResults = [
    {
      id: "mock-result-1",
      competition: "Vårsprint",
      date: "2025-04-10",
      place: 3,
      time: "34:22",
      class: "D21"
    },
    {
      id: "mock-result-2",
      competition: "Nattorientering",
      date: "2025-03-15",
      place: 5,
      time: "45:17",
      class: "D21"
    },
    {
      id: "mock-result-3",
      competition: "Vinterserien",
      date: "2025-02-20",
      place: 1,
      time: "28:45",
      class: "D21"
    }
  ];

  const handleLoginWithEventor = () => {
    setIsLoading(true);
    // Simulera inloggning
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
      // Load mock data for upcoming competitions and previous results
      setUpcomingCompetitions(mockUpcomingCompetitions);
      setPreviousResults(mockPreviousResults);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUpcomingCompetitions([]);
    setPreviousResults([]);
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
            
            {/* Upcoming Competitions Card */}
            <Card className="w-full">
              <CardHeader className="pb-2 pt-4">
                <h3 className="font-medium">Kommande tävlingar</h3>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                {upcomingCompetitions.length > 0 ? (
                  <Table>
                    <TableBody>
                      {upcomingCompetitions.map((comp) => (
                        <TableRow key={comp.id} className="hover:bg-primary/5">
                          <TableCell className="py-3 px-2">
                            <div className="space-y-1">
                              <div className="font-medium">{comp.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" /> {comp.date}
                              </div>
                              {competitionStartTimes[comp.id] && (
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Clock className="h-3.5 w-3.5" /> Starttid: {competitionStartTimes[comp.id]}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Inga kommande tävlingar</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Previous Results Card */}
            <Card className="w-full">
              <CardHeader className="pb-2 pt-4">
                <h3 className="font-medium">Mina senaste resultat</h3>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                {previousResults.length > 0 ? (
                  <Table>
                    <TableBody>
                      {previousResults.map((result) => (
                        <TableRow key={result.id} className="hover:bg-primary/5">
                          <TableCell className="py-3 px-2">
                            <div className="space-y-1">
                              <div className="font-medium">{result.competition}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" /> {result.date}
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-sm">
                                  <Trophy className="h-3.5 w-3.5 text-amber-500" /> 
                                  <span className="font-medium">Plac {result.place}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="h-3.5 w-3.5" /> 
                                  <span>{result.time}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">{result.class}</div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Inga tidigare resultat</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Stats Card - Updated year from 2024 to 2025 */}
            <Card className="w-full bg-primary/5 border-primary/10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-center font-medium">Statistik 2025</h3>
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
