import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  OrienteeringDistrict, 
  Discipline, 
  CompetitionType,
  Branch,
  Filter 
} from '../types';
import { sv } from 'date-fns/locale';
import { 
  CalendarRange, 
  Footprints, 
  Globe, 
  Calendar as CalendarIcon,
  MapPin,
  Trophy,
  Activity
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { formatSwedishDate } from '../utils/dateUtils';
import { useUserLocation } from '../hooks/useUserLocation';
import LocationInputForm from '../components/LocationInputForm';
import { formatDistance } from '../utils/distanceUtils';
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: Filter = {
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

type DatePickerType = 'from' | 'to' | null;

const ManualFilterPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);
  const [initialFilters, setInitialFilters] = useState<Filter>({} as Filter);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [datePickerType, setDatePickerType] = useState<DatePickerType>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const { userLocation, updateUserLocation } = useUserLocation();
  const [hasChanges, setHasChanges] = useState(false);
  
  // Store initial filter state when component mounts
  useEffect(() => {
    setInitialFilters(JSON.parse(JSON.stringify(filters)));
  }, []);
  
  // Check for changes whenever filters change
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      const currentFiltersStr = JSON.stringify(filters);
      const initialFiltersStr = JSON.stringify(initialFilters);
      setHasChanges(currentFiltersStr !== initialFiltersStr);
    }
  }, [filters, initialFilters]);
  
  // Calculate number of active filters for the subtitle
  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (filters.districts.length > 0) count++;
    if (filters.disciplines.length > 0) count++;
    if (filters.competitionTypes.length > 0) count++;
    if (filters.branches.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.useLocationFilter) count++;
    
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();
  const subtitle = activeFiltersCount > 0 ? `${activeFiltersCount} aktiva filter` : undefined;
  
  const allBranches = Object.values(Branch);
  const allDistricts = Object.values(OrienteeringDistrict);
  const allDisciplines = Object.values(Discipline);
  const allCompetitionTypes = Object.values(CompetitionType);

  const clearFilters = () => {
    const currentLocationSettings = {
      maxDistanceKm: filters.maxDistanceKm,
      useLocationFilter: false // Disable the location filter
    };
    
    setFilters({
      ...DEFAULT_FILTERS,
      ...currentLocationSettings
    });
  };

  const handleCancel = () => {
    // Restore initial filters
    setFilters(initialFilters);
    navigate('/competitions');
  };

  const handleSave = () => {
    // Filters are already saved in localStorage via the useLocalStorage hook
    navigate('/competitions');
  };

  const handleOpenDatePicker = (type: DatePickerType) => {
    setDatePickerType(type);
    setDatePickerOpen(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (datePickerType && date) {
      const currentDateRange = filters?.dateRange || { from: null, to: null };
      setFilters({
        ...filters,
        dateRange: {
          ...currentDateRange,
          [datePickerType]: date
        }
      });
      setDatePickerOpen(false);
    }
  };

  const handleBranchToggle = (branch: Branch) => {
    if (filters.branches.includes(branch)) {
      setFilters({
        ...filters,
        branches: filters.branches.filter(b => b !== branch)
      });
    } else {
      setFilters({
        ...filters,
        branches: [...filters.branches, branch]
      });
    }
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

  const handleLocationSelect = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setLocationDialogOpen(false);
    
    // If selecting a location, also enable the location filter
    if (!filters.useLocationFilter) {
      setFilters({
        ...filters,
        useLocationFilter: true
      });
    }
  };

  const handleLocationFilterToggle = () => {
    setFilters({
      ...filters,
      useLocationFilter: !filters.useLocationFilter
    });
  };

  const handleDistanceChange = (value: number[]) => {
    setFilters({
      ...filters,
      maxDistanceKm: value[0]
    });
  };

  // Helper functions for translations
  const getBranchTranslation = (branch: Branch) => {
    const translations: Record<Branch, string> = {
      [Branch.FootO]: 'Orienteringslöpning',
      [Branch.PreO]: 'Precisionsorientering',
      [Branch.MTBO]: 'Mountainbikeorientering',
      [Branch.SkiO]: 'Skidorientering',
      [Branch.TrailO]: 'Trail-O'
    };
    return translations[branch] || branch;
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

  const getFormattedDate = (date: Date | null) => {
    if (!date) return 'Välj datum';
    return formatSwedishDate(date, 'PPP');
  };

  // Custom action buttons for the iOS-style navigation bar
  const CancelButton = () => (
    <Button 
      variant="ghost" 
      onClick={handleCancel}
      className="text-red-600 font-medium"
    >
      Avbryt
    </Button>
  );

  const SaveButton = () => (
    <Button 
      variant="ghost" 
      onClick={handleSave}
      disabled={!hasChanges}
      className={cn(
        "font-medium",
        hasChanges ? "text-blue-600" : "text-blue-300"
      )}
    >
      Spara
    </Button>
  );

  return (
    <MobileLayout 
      title="Filtrera" 
      action={<SaveButton />}
      leftAction={<CancelButton />}
      subtitle={subtitle}
    >
      <div className="p-4 pb-16">
        <div className="space-y-8">
          {/* Two-column layout for filters with proper height management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column: District Section - removed max-height constraint */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full">
              <div className="flex items-center gap-2 text-forest mb-4">
                <Globe className="h-5 w-5" />
                <h2 className="font-semibold">Distrikt</h2>
              </div>
              
              <div className="space-y-2 overflow-y-visible">
                {allDistricts.map((district) => (
                  <div key={district} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`district-${district}`} 
                      checked={filters?.districts?.includes(district)}
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
              </div>
            </section>

            {/* Right column: Stacked sections */}
            <div className="space-y-4">
              {/* Branch Section */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-forest mb-4">
                  <Footprints className="h-5 w-5" />
                  <h2 className="font-semibold">Gren</h2>
                </div>
                
                <div className="space-y-2">
                  {allBranches.map((branch) => (
                    <div key={branch} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`branch-${branch}`} 
                        checked={filters?.branches?.includes(branch)}
                        onCheckedChange={() => handleBranchToggle(branch)}
                      />
                      <label 
                        htmlFor={`branch-${branch}`}
                        className="text-sm cursor-pointer"
                      >
                        {getBranchTranslation(branch)}
                      </label>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Discipline Section */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-forest mb-4">
                  <Activity className="h-5 w-5" />
                  <h2 className="font-semibold">Discipliner</h2>
                </div>
                
                <div className="space-y-2">
                  {allDisciplines.map((discipline) => (
                    <div key={discipline} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`discipline-${discipline}`} 
                        checked={filters?.disciplines?.includes(discipline)}
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
                </div>
              </section>
              
              {/* Competition Type Section */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-forest mb-4">
                  <Trophy className="h-5 w-5" />
                  <h2 className="font-semibold">Tävlingstyper</h2>
                </div>
                
                <div className="space-y-2">
                  {allCompetitionTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={filters?.competitionTypes?.includes(type)}
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
                </div>
              </section>
            </div>
          </div>
          
          {/* Date Range Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-forest mb-4">
              <CalendarRange className="h-5 w-5" />
              <h2 className="font-semibold">Datumintervall</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Från</Label>
                <Button
                  variant="outline"
                  onClick={() => handleOpenDatePicker('from')}
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {getFormattedDate(filters?.dateRange?.from)}
                </Button>
              </div>
              <div>
                <Label className="mb-2 block">Till</Label>
                <Button
                  variant="outline"
                  onClick={() => handleOpenDatePicker('to')}
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {getFormattedDate(filters?.dateRange?.to)}
                </Button>
              </div>
            </div>
          </section>

          {/* Location Filter Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-forest mb-4">
              <MapPin className="h-5 w-5" />
              <h2 className="font-semibold">Platsfiltrering</h2>
            </div>

            <div className="space-y-4">
              {/* Location filter toggle - updated to use Switch instead of Checkbox */}
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="use-location-filter"
                  className="text-sm"
                >
                  Filtrera tävlingar baserat på avstånd
                </label>
                <Switch 
                  id="use-location-filter"
                  checked={filters.useLocationFilter}
                  onCheckedChange={handleLocationFilterToggle}
                />
              </div>

              {/* Selected location display and change button */}
              <div className="space-y-2">
                <Label className="block">Plats</Label>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "border rounded-md p-2 flex-1", 
                    !filters.useLocationFilter ? "bg-gray-100" : "bg-gray-50"
                  )}>
                    {userLocation ? (
                      <div className="flex items-center gap-2">
                        <MapPin className={cn(
                          "h-4 w-4 flex-shrink-0", 
                          filters.useLocationFilter ? "text-forest" : "text-gray-400"
                        )} />
                        <span className={!filters.useLocationFilter ? "text-gray-500" : ""}>
                          {userLocation.city}
                        </span>
                      </div>
                    ) : (
                      <div className="text-gray-500">Ingen plats vald</div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setLocationDialogOpen(true)}
                    className="whitespace-nowrap"
                  >
                    {userLocation ? 'Ändra' : 'Välj plats'}
                  </Button>
                </div>
              </div>

              {/* Distance slider - Updated with better disabled state visualization */}
              <div className={cn(
                "space-y-4",
                !filters.useLocationFilter && "opacity-75"
              )}>
                <div className="flex justify-between items-center">
                  <Label className={!filters.useLocationFilter ? "text-gray-500" : ""}>
                    Maxavstånd
                  </Label>
                  <span className={cn(
                    "text-sm font-medium",
                    !filters.useLocationFilter && "text-gray-500"
                  )}>
                    {formatDistance(filters.maxDistanceKm)}
                  </span>
                </div>
                <div className="py-2">
                  <input
                    type="range"
                    disabled={!filters.useLocationFilter}
                    value={filters.maxDistanceKm}
                    min={5}
                    max={500}
                    step={5}
                    onChange={(e) => handleDistanceChange([parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 km</span>
                  <span>500 km</span>
                </div>
              </div>
            </div>
          </section>
          
          {/* Clear filter button - Added at the bottom with less margin */}
          <div className="mt-8 mb-4">
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full border-dashed border-gray-300"
            >
              Rensa filtret
            </Button>
          </div>
        </div>

        {/* Date picker dialog */}
        <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {datePickerType === 'from' ? 'Välj startdatum' : 'Välj slutdatum'}
              </DialogTitle>
              <DialogDescription>
                Välj datum nedan
              </DialogDescription>
            </DialogHeader>
            <Calendar
              mode="single"
              selected={datePickerType === 'from' 
                ? filters?.dateRange?.from || undefined 
                : filters?.dateRange?.to || undefined
              }
              onSelect={handleDateSelect}
              disabled={(date) => 
                datePickerType === 'from'
                  ? filters?.dateRange?.to ? date > filters.dateRange.to : false
                  : filters?.dateRange?.from ? date < filters.dateRange.from : false
              }
              locale={sv}
              className="mx-auto"
            />
          </DialogContent>
        </Dialog>

        {/* Location selection dialog */}
        <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Välj plats
              </DialogTitle>
              <DialogDescription>
                Sök efter en stad eller plats för att filtrera tävlingar baserat på avstånd.
              </DialogDescription>
            </DialogHeader>
            <LocationInputForm 
              onLocationSelected={handleLocationSelect}
              onCancel={() => setLocationDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
};

export default ManualFilterPage;
