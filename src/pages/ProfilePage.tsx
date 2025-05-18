
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Calendar, 
  MapPin, 
  Trophy, 
  Clock, 
  Settings, 
  ExternalLink, 
  Heart, 
  Mail, 
  Home, 
  Flag 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SkeletonProfile from '@/components/profile/SkeletonProfile';
import LoginWaitlistDialog from '@/components/profile/LoginWaitlistDialog';
import ProfileSettings from '@/components/profile/ProfileSettings';
import { 
  CompetitionSummary, 
  Discipline, 
  CompetitionType, 
  OrienteeringDistrict, 
  Branch 
} from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

// InfoItem component moved from ProfileSettings to here since we're using it in this file now
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, isLast = false }) => {
  return (
    <div className={cn("px-6 py-4 flex items-start", !isLast && "border-b border-border/40")}>
      <div className="mr-3 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-medium">{value}</p>
      </div>
    </div>
  );
};

// Competition item for upcoming competitions
interface CompetitionItemProps {
  competition: CompetitionSummary;
  startTime: string | null;
}

const CompetitionItem: React.FC<CompetitionItemProps> = ({ competition, startTime }) => {
  const formattedDate = format(new Date(competition.date), 'd MMM', { locale: sv });
  
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border/40 last:border-b-0">
      <div className="flex-1">
        <p className="font-medium">{competition.name}</p>
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
          {startTime && (
            <>
              <span className="mx-1">•</span>
              <Clock className="h-3.5 w-3.5" />
              <span>{startTime}</span>
            </>
          )}
        </div>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Result item for previous results
interface ResultItemProps {
  result: {
    id: string;
    competition: string;
    date: string;
    place: number;
    time: string;
    class: string;
  };
}

const ResultItem: React.FC<ResultItemProps> = ({ result }) => {
  const formattedDate = format(new Date(result.date), 'd MMM', { locale: sv });
  
  return (
    <TableRow>
      <TableCell className="py-2.5">
        <div className="font-medium">{result.competition}</div>
        <div className="text-xs text-muted-foreground">{formattedDate}</div>
      </TableCell>
      <TableCell className="py-2.5 text-center">
        <div className={cn(
          "font-medium",
          result.place === 1 && "text-yellow-500",
          result.place === 2 && "text-gray-400",
          result.place === 3 && "text-amber-700"
        )}>
          {result.place}
        </div>
      </TableCell>
      <TableCell className="py-2.5 text-right">
        <div className="font-medium">{result.time}</div>
        <div className="text-xs text-muted-foreground">{result.class}</div>
      </TableCell>
    </TableRow>
  );
};

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
    preferredClass: "D21",
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
            <Card className="border-primary/20 overflow-hidden">
              <CardHeader className="pb-2 bg-primary/5">
                <h2 className="text-lg font-medium">Kommande tävlingar</h2>
              </CardHeader>
              <CardContent className="p-0">
                {upcomingCompetitions.length > 0 ? (
                  <div className="divide-y">
                    {upcomingCompetitions.map(competition => (
                      <CompetitionItem 
                        key={competition.id} 
                        competition={competition}
                        startTime={competitionStartTimes[competition.id]}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    <p>Inga kommande tävlingar</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Previous Results Card */}
            <Card className="border-primary/20 overflow-hidden">
              <CardHeader className="pb-2 bg-primary/5">
                <h2 className="text-lg font-medium">Senaste resultat</h2>
              </CardHeader>
              <CardContent className="p-4">
                {previousResults.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Tävling</TableHead>
                        <TableHead className="text-center w-[20%]">Plac</TableHead>
                        <TableHead className="text-right w-[30%]">Tid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previousResults.map(result => (
                        <ResultItem key={result.id} result={result} />
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-4 text-center text-muted-foreground">
                    <p>Inga tidigare resultat</p>
                  </div>
                )}
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
