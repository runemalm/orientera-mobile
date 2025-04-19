
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Globe, 
  Activity, 
  Calendar, 
  CheckCircle
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  OrienteeringDistrict, 
  Discipline, 
  CompetitionType 
} from '../types';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Label } from '@/components/ui/label';
import LocationInputForm from '../components/LocationInputForm';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import OrienteeringCheckpointIcon from '../components/OrienteeringCheckpointIcon';

interface Filter {
  useLocationFilter: boolean;
  maxDistanceKm: number;
  districts: OrienteeringDistrict[];
  disciplines: Discipline[];
  competitionTypes: CompetitionType[];
}

const DEFAULT_FILTERS: Filter = {
  useLocationFilter: true,
  maxDistanceKm: 100,
  districts: [],
  disciplines: [],
  competitionTypes: []
};

const CompetitionFilterPage = () => {
  const navigate = useNavigate();
  const { userLocation, updateUserLocation } = useUserLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);

  // Districts selection
  const allDistricts = Object.values(OrienteeringDistrict);
  const [districtCollapsibleOpen, setDistrictCollapsibleOpen] = useState(filters.districts.length > 0);
  
  // Disciplines selection
  const allDisciplines = Object.values(Discipline);
  const [disciplineCollapsibleOpen, setDisciplineCollapsibleOpen] = useState(filters.disciplines.length > 0);

  // Competition types selection
  const allCompetitionTypes = Object.values(CompetitionType);
  const [competitionTypeCollapsibleOpen, setCompetitionTypeCollapsibleOpen] = useState(filters.competitionTypes.length > 0);

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setDrawerOpen(false);
  };

  const handleDistrictToggle = (district: OrienteeringDistrict) => {
    if (filters.districts.includes(district)) {
      setFilters({
        ...filters,
        districts: filters.districts.filter(d => d !== district)
      });
    } else {
      setFilters({
        ...filters,
        districts: [...filters.districts, district]
      });
    }
  };

  const handleDisciplineToggle = (discipline: Discipline) => {
    if (filters.disciplines.includes(discipline)) {
      setFilters({
        ...filters,
        disciplines: filters.disciplines.filter(d => d !== discipline)
      });
    } else {
      setFilters({
        ...filters,
        disciplines: [...filters.disciplines, discipline]
      });
    }
  };

  const handleCompetitionTypeToggle = (type: CompetitionType) => {
    if (filters.competitionTypes.includes(type)) {
      setFilters({
        ...filters,
        competitionTypes: filters.competitionTypes.filter(t => t !== type)
      });
    } else {
      setFilters({
        ...filters,
        competitionTypes: [...filters.competitionTypes, type]
      });
    }
  };

  const handleApplyFilters = () => {
    navigate(-1);
    toast.success('Filter inställningar sparade', {
      description: 'Dina filterinställningar har uppdaterats'
    });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast.info('Filtren har återställts');
  };

  const getDistrictTranslation = (district: OrienteeringDistrict) => {
    return district.replace(' OF', '');
  };

  const getDisciplineTranslation = (discipline: Discipline) => {
    const translations: Record<Discipline, string> = {
      [Discipline.Sprint]: 'Sprint',
      [Discipline.Middle]: 'Medel',
      [Discipline.Long]: 'Lång',
      [Discipline.Night]: 'Natt',
      [Discipline.Relay]: 'Stafett',
      [Discipline.UltraLong]: 'Ultra-lång',
      [Discipline.PreO]: 'PreO',
      [Discipline.TempO]: 'TempO'
    };
    return translations[discipline] || discipline;
  };

  const getCompetitionTypeTranslation = (type: CompetitionType) => {
    const translations: Record<CompetitionType, string> = {
      [CompetitionType.Championship]: 'Mästerskap',
      [CompetitionType.National]: 'Nationell tävling',
      [CompetitionType.Regional]: 'Regional tävling',
      [CompetitionType.Near]: 'Närtävling',
      [CompetitionType.Club]: 'Klubbtävling',
      [CompetitionType.Weekly]: 'Veckotävling'
    };
    return translations[type] || type;
  };

  return (
    <MobileLayout 
      title="Filter" 
      action={
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      }
    >
      <div className="p-4 pb-24">
        <div className="space-y-6">
          {/* Location Filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-forest mb-3">
              <MapPin className="h-5 w-5" />
              <h2 className="font-semibold">Plats</h2>
              <div className="flex-grow"></div>
              <Switch 
                id="location-filter"
                checked={filters.useLocationFilter}
                onCheckedChange={(checked) => setFilters({...filters, useLocationFilter: checked})}
              />
            </div>
            
            {filters.useLocationFilter && (
              <div className="space-y-4 mt-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{userLocation?.city}</span>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setDrawerOpen(true)}
                      className="text-forest hover:text-forest-dark border-forest hover:border-forest-dark"
                    >
                      Byt plats
                    </Button>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="distance-slider" className="text-sm text-gray-600">
                      Maxavstånd: {filters.maxDistanceKm} km
                    </Label>
                  </div>
                  <Slider
                    id="distance-slider"
                    defaultValue={[filters.maxDistanceKm]}
                    min={5}
                    max={500}
                    step={5}
                    onValueChange={([value]) => {
                      setFilters({...filters, maxDistanceKm: value});
                    }}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>5 km</span>
                    <span>500 km</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* District Filter */}
          <Collapsible
            open={districtCollapsibleOpen}
            onOpenChange={setDistrictCollapsibleOpen}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 text-forest p-4">
              <Globe className="h-5 w-5" />
              <h2 className="font-semibold">Distrikt</h2>
              <div className="flex-grow"></div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <span className="text-xs">
                    {filters.districts.length > 0 
                      ? `${filters.districts.length} valda` 
                      : "Visa alla"}
                  </span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="px-4 pb-4 space-y-2">
              {allDistricts.map((district) => (
                <div key={district} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`district-${district}`} 
                    checked={filters.districts.includes(district)}
                    onCheckedChange={() => handleDistrictToggle(district)}
                  />
                  <label 
                    htmlFor={`district-${district}`}
                    className="text-sm cursor-pointer"
                  >
                    {getDistrictTranslation(district)}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          
          {/* Discipline Filter */}
          <Collapsible
            open={disciplineCollapsibleOpen}
            onOpenChange={setDisciplineCollapsibleOpen}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 text-forest p-4">
              <Activity className="h-5 w-5" />
              <h2 className="font-semibold">Discipliner</h2>
              <div className="flex-grow"></div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <span className="text-xs">
                    {filters.disciplines.length > 0 
                      ? `${filters.disciplines.length} valda` 
                      : "Visa alla"}
                  </span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="px-4 pb-4 space-y-2">
              {allDisciplines.map((discipline) => (
                <div key={discipline} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`discipline-${discipline}`} 
                    checked={filters.disciplines.includes(discipline)}
                    onCheckedChange={() => handleDisciplineToggle(discipline)}
                  />
                  <label 
                    htmlFor={`discipline-${discipline}`}
                    className="text-sm cursor-pointer"
                  >
                    {getDisciplineTranslation(discipline)}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          
          {/* Competition Type Filter */}
          <Collapsible
            open={competitionTypeCollapsibleOpen}
            onOpenChange={setCompetitionTypeCollapsibleOpen}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 text-forest p-4">
              <Calendar className="h-5 w-5" />
              <h2 className="font-semibold">Tävlingstyper</h2>
              <div className="flex-grow"></div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <span className="text-xs">
                    {filters.competitionTypes.length > 0 
                      ? `${filters.competitionTypes.length} valda` 
                      : "Visa alla"}
                  </span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="px-4 pb-4 space-y-2">
              {allCompetitionTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`} 
                    checked={filters.competitionTypes.includes(type)}
                    onCheckedChange={() => handleCompetitionTypeToggle(type)}
                  />
                  <label 
                    htmlFor={`type-${type}`}
                    className="text-sm cursor-pointer"
                  >
                    {getCompetitionTypeTranslation(type)}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleResetFilters}
            >
              Återställ
            </Button>
            <Button 
              className="flex-1 bg-forest hover:bg-forest-dark"
              onClick={handleApplyFilters}
            >
              Tillämpa filter
            </Button>
          </div>
        </div>
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Byt plats</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <LocationInputForm 
              onLocationSelected={handleUpdateLocation}
              onCancel={() => setDrawerOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
};

export default CompetitionFilterPage;
