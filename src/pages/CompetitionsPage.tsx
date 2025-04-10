import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { MapPin, RefreshCw, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import LocationInputForm from '../components/LocationInputForm';
import { useUserLocation } from '../hooks/useUserLocation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Competition } from '../types';
import { format, addDays, startOfWeek, isSameDay, isSameMonth } from 'date-fns';

interface CompetitionWithDistance extends Omit<Competition, 'distance'> {
  distance: number;
}

interface CompetitionsByWeek {
  weekStart: Date;
  weekEnd: Date;
  competitions: CompetitionWithDistance[];
}

interface DayCompetitions {
  date: Date;
  competitions: CompetitionWithDistance[];
}

interface MonthGroup {
  month: Date;
  weeks: CompetitionsByWeek[];
}

const CompetitionsPage: React.FC = () => {
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);
  const [showResetDrawer, setShowResetDrawer] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const { userLocation, isFirstVisit, isLoading, updateUserLocation, resetUserLocation } = useUserLocation();

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationDrawer(false);
  };
  
  const handleResetLocation = () => {
    resetUserLocation();
    setShowResetDrawer(false);
  };

  const handleTap = () => {
    setTapCount(prevCount => prevCount + 1);
    
    if (tapCount >= 2) {
      setShowResetDrawer(true);
      setTapCount(0);
    } else {
      setTimeout(() => {
        setTapCount(0);
      }, 2000);
    }
  };

  const processCompetitionWithDistance = (competition: typeof mockCompetitions[0]): CompetitionWithDistance => {
    if (!userLocation) {
      return {
        ...competition,
        distance: 0
      };
    }
    
    return {
      ...competition,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        competition.coordinates.latitude,
        competition.coordinates.longitude
      )
    };
  };

  const groupCompetitionsByWeek = (): CompetitionsByWeek[] => {
    if (!userLocation || mockCompetitions.length === 0) return [];
    
    const processedCompetitions = mockCompetitions.map(processCompetitionWithDistance);
    const groupedByWeek: CompetitionsByWeek[] = [];
    
    processedCompetitions.forEach(competition => {
      const competitionDate = new Date(competition.date);
      const weekStart = new Date(competitionDate);
      weekStart.setDate(competitionDate.getDate() - competitionDate.getDay() + (competitionDate.getDay() === 0 ? -6 : 1));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const existingWeekGroup = groupedByWeek.find(group => {
        return group.weekStart.getTime() === weekStart.getTime();
      });
      
      if (existingWeekGroup) {
        existingWeekGroup.competitions.push(competition);
      } else {
        groupedByWeek.push({
          weekStart,
          weekEnd,
          competitions: [competition]
        });
      }
    });
    
    return groupedByWeek.sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());
  };

  const organizeCompetitionsByDay = (weekGroup: CompetitionsByWeek): DayCompetitions[] => {
    const days: DayCompetitions[] = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(weekGroup.weekStart, i);
      days.push({
        date: currentDate,
        competitions: []
      });
    }
    
    weekGroup.competitions.forEach(competition => {
      const competitionDate = new Date(competition.date);
      
      const dayEntry = days.find(day => isSameDay(day.date, competitionDate));
      if (dayEntry) {
        dayEntry.competitions.push(competition);
      }
    });
    
    return days;
  };

  const formatWeekHeader = (start: Date): string => {
    const weekNumber = getWeekNumber(start);
    return `Vecka ${weekNumber}`;
  };

  const formatMonthHeader = (date: Date): string => {
    return format(date, 'MMMM yyyy');
  };

  const formatDayOfMonth = (date: Date): string => {
    return format(date, 'd');
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const groupWeeksByMonth = (weeks: CompetitionsByWeek[]): MonthGroup[] => {
    const monthGroups: MonthGroup[] = [];
    
    weeks.forEach(week => {
      const monthDate = new Date(week.weekStart);
      const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
      
      const existingMonthGroup = monthGroups.find(group => 
        group.month.getFullYear() === monthDate.getFullYear() && 
        group.month.getMonth() === monthDate.getMonth()
      );
      
      if (existingMonthGroup) {
        existingMonthGroup.weeks.push(week);
      } else {
        monthGroups.push({
          month: monthDate,
          weeks: [week]
        });
      }
    });
    
    return monthGroups.sort((a, b) => a.month.getTime() - b.month.getTime());
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600">Laddar...</p>
        </div>
      );
    }

    if (!userLocation) {
      return (
        <div className="space-y-6 py-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="bg-location/10 p-3 rounded-full w-14 h-14 mb-4 flex items-center justify-center">
                <MapPin size={28} className="text-location" />
              </div>
              <h2 className="text-xl font-medium mb-2 text-center">Hitta tävlingar nära dig</h2>
              <p className="text-gray-600 mb-6 text-center">
                För att visa tävlingar nära dig behöver vi veta din plats.
              </p>
              
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="search">Sök plats</TabsTrigger>
                  <TabsTrigger value="examples">Populära platser</TabsTrigger>
                </TabsList>
                
                <TabsContent value="search" className="space-y-4">
                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="h-5 w-5 text-location" />
                      <span className="font-medium">Skriv in din plats</span>
                    </div>
                    
                    <LocationInputForm 
                      onLocationSelected={handleUpdateLocation}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="examples">
                  <div className="grid gap-2">
                    {['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Örebro'].map((city) => (
                      <Button 
                        key={city}
                        variant="outline" 
                        className="justify-start h-auto py-3 px-4 w-full text-left"
                        onClick={() => {
                          handleUpdateLocation({
                            city: city,
                            latitude: 0,
                            longitude: 0
                          });
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2 text-location" />
                        <span>{city}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="text-center text-xs text-gray-500 mt-6">
                <p>Din position sparas på din enhet för framtida besök.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    const displayName = userLocation.city.length > 25 
      ? userLocation.city.split(',')[0]
      : userLocation.city;
    
    const competitionsByWeek = groupCompetitionsByWeek();
    const monthGroups = groupWeeksByMonth(competitionsByWeek);
    
    return (
      <>
        <div className="bg-gradient-to-br from-location-light/30 to-location-light/10 rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-location/10 p-2 rounded-full">
                <MapPin size={18} className="text-location" />
              </div>
              <div>
                <span className="font-medium text-sm line-clamp-1 text-location-dark">{displayName}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowLocationDrawer(true)}
              className="text-location border-location/30 hover:bg-location/10"
            >
              Byt plats
            </Button>
          </div>
        </div>
        
        {monthGroups.length > 0 ? (
          <div className="space-y-6">
            {monthGroups.map((monthGroup, monthIndex) => (
              <div key={monthIndex} className="space-y-4">
                <div className="sticky top-0 z-10 bg-primary/10 px-4 py-3 rounded-lg font-semibold text-primary capitalize">
                  {formatMonthHeader(monthGroup.month)}
                </div>
                
                {monthGroup.weeks.map((weekGroup, weekIndex) => (
                  <div key={weekIndex} className="space-y-2">
                    <div className="sticky top-12 z-5 bg-gray-50 px-3 py-2 rounded-md font-medium text-sm text-gray-600">
                      {formatWeekHeader(weekGroup.weekStart)}
                    </div>
                    
                    {organizeCompetitionsByDay(weekGroup).map((dayGroup, dayIndex) => (
                      <div key={dayIndex} className="mb-2">
                        {dayGroup.competitions.length > 0 ? (
                          dayGroup.competitions.map(competition => (
                            <div key={competition.id} className="flex items-center">
                              <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-primary font-semibold">
                                {formatDayOfMonth(dayGroup.date)}
                              </div>
                              <div className="flex-1">
                                <CompetitionCard competition={competition} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-gray-500 font-semibold">
                              {formatDayOfMonth(dayGroup.date)}
                            </div>
                            <div className="flex-1 bg-white/50 rounded-lg border border-gray-100 p-3 text-sm text-gray-400">
                              Inga tävlingar
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </div>
            <p className="text-gray-500">Inga tävlingar hittades</p>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <MobileLayout title="Tävlingar i närheten">
        <div className="mt-4" onClick={handleTap}>
          {renderContent()}
        </div>
      </MobileLayout>
      
      <Drawer open={showLocationDrawer} onOpenChange={setShowLocationDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Ange din plats</DrawerTitle>
            <DrawerDescription>
              Ange din plats för att hitta tävlingar nära dig.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <LocationInputForm 
              onLocationSelected={handleUpdateLocation}
              onCancel={() => setShowLocationDrawer(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
      
      <Drawer open={showResetDrawer} onOpenChange={setShowResetDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Återställ platsval</DrawerTitle>
            <DrawerDescription>
              Detta kommer ta bort din sparade plats. Du kommer att behöva ange din plats igen.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="flex justify-center">
              <RefreshCw size={48} className="text-primary" />
            </div>
            <Button 
              onClick={handleResetLocation}
              className="w-full"
            >
              Återställ plats
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowResetDrawer(false)}
              className="w-full"
            >
              Avbryt
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
};

export default CompetitionsPage;
