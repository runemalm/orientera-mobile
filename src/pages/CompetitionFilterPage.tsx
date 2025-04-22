import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CircleCheck, CalendarRange, Filter, Map, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import LocationInputForm from '../components/LocationInputForm';
import { OrienteeringDistrict, Discipline, CompetitionType, Branch } from '../types';

interface FilterState {
  useLocationFilter: boolean;
  maxDistanceKm: number;
  districts: string[];
  disciplines: string[];
  competitionTypes: string[];
  branches: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

const DEFAULT_FILTERS: FilterState = {
  useLocationFilter: false,
  maxDistanceKm: 100,
  districts: [],
  disciplines: [],
  competitionTypes: [],
  branches: [],
  dateRange: {
    from: null,
    to: null
  }
};

const CompetitionFilterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userLocation, updateUserLocation } = useUserLocation();
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filters, setFilters] = useLocalStorage<FilterState>('competitionFilters', DEFAULT_FILTERS);
  const [useLocationFilter, setUseLocationFilter] = useState(filters?.useLocationFilter || false);
  const [maxDistanceKm, setMaxDistanceKm] = useState(filters?.maxDistanceKm || 100);
  const [districts, setDistricts] = useState<string[]>(filters?.districts || []);
  const [disciplines, setDisciplines] = useState<string[]>(filters?.disciplines || []);
  const [competitionTypes, setCompetitionTypes] = useState<string[]>(filters?.competitionTypes || []);
  const [branches, setBranches] = useState<string[]>(filters?.branches || []);
  const [dateRange, setDateRange] = useState(filters?.dateRange || { from: null, to: null });

  useEffect(() => {
    if (filters) {
      setUseLocationFilter(filters.useLocationFilter);
      setMaxDistanceKm(filters.maxDistanceKm);
      setDistricts(filters.districts);
      setDisciplines(filters.disciplines);
      setCompetitionTypes(filters.competitionTypes);
      setBranches(filters.branches);
      setDateRange(filters.dateRange);
    }
  }, [filters]);

  const handleLocationUpdate = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationInput(false);
  };

  const handleApplyFilters = () => {
    setFilters({
      useLocationFilter,
      maxDistanceKm,
      districts,
      disciplines,
      competitionTypes,
      branches,
      dateRange
    });
    toast({
      title: "Filter uppdaterade",
      description: "Tävlingar kommer nu att filtreras enligt dina val.",
    });
    navigate(-1);
  };

  const handleResetFilters = () => {
    setUseLocationFilter(DEFAULT_FILTERS.useLocationFilter);
    setMaxDistanceKm(DEFAULT_FILTERS.maxDistanceKm);
    setDistricts(DEFAULT_FILTERS.districts);
    setDisciplines(DEFAULT_FILTERS.disciplines);
    setCompetitionTypes(DEFAULT_FILTERS.competitionTypes);
    setBranches(DEFAULT_FILTERS.branches);
    setDateRange(DEFAULT_FILTERS.dateRange);
    setFilters(DEFAULT_FILTERS);
    toast({
      title: "Filter återställda",
      description: "Alla filter har återställts till standardinställningar.",
    });
    navigate(-1);
  };

  if (showLocationInput) {
    return (
      <MobileLayout title="Välj plats" showBackButton>
        <div className="p-4">
          <LocationInputForm
            onLocationSelected={handleLocationUpdate}
            onCancel={() => setShowLocationInput(false)}
          />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Filterinställningar" showBackButton>
      <ScrollArea className="h-[calc(100vh-64px)] pb-24">
        <div className="px-4 py-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plats</CardTitle>
              <CardDescription>Använd din plats för att hitta tävlingar nära dig</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">Använd platsfilter</p>
                  <p className="text-sm text-muted-foreground">Visar endast tävlingar inom en viss radie</p>
                </div>
                <Switch id="location-filter" checked={useLocationFilter} onCheckedChange={setUseLocationFilter} />
              </div>
              {useLocationFilter && (
                <div className="space-y-2">
                  <Label htmlFor="distance">Maximalt avstånd ({maxDistanceKm} km)</Label>
                  <Slider
                    id="distance"
                    defaultValue={[maxDistanceKm]}
                    max={200}
                    step={10}
                    disabled={!useLocationFilter}
                    onValueChange={(value) => setMaxDistanceKm(value[0])}
                  />
                  <p className="text-sm text-muted-foreground">
                    Tävlingar längre bort än {maxDistanceKm} km visas inte
                  </p>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">{userLocation?.city || 'Ingen plats vald'}</p>
                  <p className="text-sm text-muted-foreground">Ändra plats för mer relevanta resultat</p>
                </div>
                <Button variant="outline" onClick={() => setShowLocationInput(true)}>
                  Byt plats
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distrikt</CardTitle>
              <CardDescription>Välj distrikt att visa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(OrienteeringDistrict).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={`district-${key}`}
                      checked={districts.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setDistricts([...districts, value]);
                        } else {
                          setDistricts(districts.filter(d => d !== value));
                        }
                      }}
                    />
                    <Label htmlFor={`district-${key}`}>{value}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discipliner</CardTitle>
              <CardDescription>Välj tävlingsdiscipliner</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(Discipline).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={`discipline-${key}`}
                      checked={disciplines.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setDisciplines([...disciplines, value]);
                        } else {
                          setDisciplines(disciplines.filter(d => d !== value));
                        }
                      }}
                    />
                    <Label htmlFor={`discipline-${key}`}>{value}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tävlingstyper</CardTitle>
              <CardDescription>Välj typer av tävlingar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CompetitionType).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={`competition-type-${key}`}
                      checked={competitionTypes.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCompetitionTypes([...competitionTypes, value]);
                        } else {
                          setCompetitionTypes(competitionTypes.filter(t => t !== value));
                        }
                      }}
                    />
                    <Label htmlFor={`competition-type-${key}`}>{value}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grenar</CardTitle>
              <CardDescription>Välj orienteringsgrenar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(Branch).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={`branch-${key}`}
                      checked={branches.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBranches([...branches, value]);
                        } else {
                          setBranches(branches.filter(b => b !== value));
                        }
                      }}
                    />
                    <Label htmlFor={`branch-${key}`}>{value}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between">
          <Button variant="ghost" onClick={handleResetFilters}>
            Återställ
          </Button>
          <Button onClick={handleApplyFilters}>
            Använd filter
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CompetitionFilterPage;
