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
import { format, addDays, startOfWeek, isSameDay, isSameMonth, subWeeks, isAfter, isBefore, startOfDay } from 'date-fns';

interface CompetitionWithDistance extends Omit<Competition, 'distance'> {
  distance: number;
}

interface DayCompetitions {
  date: Date;
  competitions: CompetitionWithDistance[];
}

interface MonthGroup {
  month: Date;
  days: DayCompetitions[];
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

  const getCompetitionsFromLastWeek = (): DayCompetitions[] => {
    if (!userLocation || mockCompetitions.length === 0) return [];
    
    const processedCompetitions = mockCompetitions.map(processCompetitionWithDistance);
    const today = startOfDay(new Date());
    
    // Get Monday of the previous week
    const mondayLastWeek = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
    
    // Filter competitions from monday last week onwards
    const filteredCompetitions = processedCompetitions.filter(competition => {
      const competitionDate = new Date(competition.date);
      return isAfter(competitionDate, mondayLastWeek) || isSameDay(competitionDate, mondayLastWeek);
    });
    
    // Group by day
    const competitionsByDay: DayCompetitions[] = [];
    
    filteredCompetitions.forEach(competition => {
      const competitionDate = startOfDay(new Date(competition.date));
      
      const existingDayGroup = competitionsByDay.find(day => 
        isSameDay(day.date, competitionDate)
      );
      
      if (existingDayGroup) {
        existingDayGroup.competitions.push(competition);
      } else {
        competitionsByDay.push({
          date: competitionDate,
          competitions: [competition]
        });
      }
    });
    
    // Sort by date
    return competitionsByDay.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const groupDaysByMonth = (days: DayCompetitions[]): MonthGroup[] => {
    const monthGroups: MonthGroup[] = [];
    
    days.forEach(day => {
      const monthDate = new Date(day.date);
      
      const existingMonthGroup = monthGroups.find(group => 
        group.month.getFullYear() === monthDate.getFullYear() && 
        group.month.getMonth() === monthDate.getMonth()
      );
      
      if (existingMonthGroup) {
        existingMonthGroup.days.push(day);
      } else {
        monthGroups.push({
          month: monthDate,
          days: [day]
        });
      }
    });
    
    return monthGroups.sort((a, b) => a.month.getTime() - b.month.getTime());
  };

  const formatMonthHeader = (date: Date): string => {
    return format(date, 'MMMM yyyy');
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
    
    const competitionsByDay = getCompetitionsFromLastWeek();
    const monthGroups = groupDaysByMonth(competitionsByDay);
    
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
                
                {monthGroup.days.map((dayGroup, dayIndex) => (
                  <div key={dayIndex} className="mb-3">
                    {dayGroup.competitions.length > 0 ? (
                      <div className="space-y-2">
                        <div className="font-medium text-sm text-gray-500 ml-1">
                          {format(dayGroup.date, 'EEEE, d MMMM')}
                        </div>
                        {dayGroup.competitions.map(competition => (
                          <CompetitionCard key={competition.id} competition={competition} />
                        ))}
                      </div>
                    ) : null}
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
