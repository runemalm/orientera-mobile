
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Save, 
  Globe, 
  Activity, 
  Calendar as CalendarIcon,
  CalendarRange 
} from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import LocationInputForm from '../components/LocationInputForm';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { 
  OrienteeringDistrict, 
  Discipline, 
  CompetitionType,
  Branch
} from '../types';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Filter {
  districts: OrienteeringDistrict[];
  disciplines: Discipline[];
  competitionTypes: CompetitionType[];
  branches: Branch[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

const DEFAULT_FILTERS: Filter = {
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
  const { userLocation, updateUserLocation } = useUserLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);

  const hasDateFilter = Boolean(filters?.dateRange?.from || filters?.dateRange?.to);

  const [dateRangeCollapsibleOpen, setDateRangeCollapsibleOpen] = useState(false);
  const [branchCollapsibleOpen, setBranchCollapsibleOpen] = useState(false);
  const [districtCollapsibleOpen, setDistrictCollapsibleOpen] = useState(false);
  const [disciplineCollapsibleOpen, setDisciplineCollapsibleOpen] = useState(false);
  const [competitionTypeCollapsibleOpen, setCompetitionTypeCollapsibleOpen] = useState(false);

  const allBranches = Object.values(Branch);
  const allDistricts = Object.values(OrienteeringDistrict);
  const allDisciplines = Object.values(Discipline);
  const allCompetitionTypes = Object.values(CompetitionType);

  useEffect(() => {
    setDateRangeCollapsibleOpen(false);
    setBranchCollapsibleOpen(false);
    setDistrictCollapsibleOpen(false);
    setDisciplineCollapsibleOpen(false);
    setCompetitionTypeCollapsibleOpen(false);
  }, []);

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setDrawerOpen(false);
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

  const handleDateRangeChange = (date: Date | undefined, type: 'from' | 'to') => {
    const currentDateRange = filters?.dateRange || { from: null, to: null };
    
    setFilters({
      ...filters,
      dateRange: {
        ...currentDateRange,
        [type]: date || null
      }
    });
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

  const handleSaveFilters = () => {
    navigate(-1);
    toast.success('Filter inställningar sparade', {
      description: 'Dina filterinställningar har uppdaterats'
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

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

  return (
    <MobileLayout 
      title="Filter" 
      showBackButton={false}
      action={
        <Button 
          size="sm"
          variant="ghost"
          onClick={handleSaveFilters}
          className="text-forest hover:text-forest-dark"
        >
          Spara
        </Button>
      }
      leftAction={
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      }
    >
      <div className="p-4 pb-24">
        <div className="space-y-6">
          <Collapsible
            open={dateRangeCollapsibleOpen}
            onOpenChange={setDateRangeCollapsibleOpen}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 text-forest p-4">
                <CalendarRange className="h-5 w-5" />
                <h2 className="font-semibold">Datumintervall</h2>
                <div className="flex-grow"></div>
                <span className="text-xs">
                  {hasDateFilter ? 'Aktivt filter' : 'Visa alla'}
                </span>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Från</Label>
                  <Calendar
                    mode="single"
                    selected={filters?.dateRange?.from || undefined}
                    onSelect={(date) => handleDateRangeChange(date, 'from')}
                    disabled={(date) => 
                      filters?.dateRange?.to ? date > filters.dateRange.to : false
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Till</Label>
                  <Calendar
                    mode="single"
                    selected={filters?.dateRange?.to || undefined}
                    onSelect={(date) => handleDateRangeChange(date, 'to')}
                    disabled={(date) => 
                      filters?.dateRange?.from ? date < filters.dateRange.from : false
                    }
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={branchCollapsibleOpen}
            onOpenChange={setBranchCollapsibleOpen}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 text-forest p-4">
                <Activity className="h-5 w-5" />
                <h2 className="font-semibold">Gren</h2>
                <div className="flex-grow"></div>
                <span className="text-xs">
                  {filters?.branches?.length > 0 
                    ? `${filters.branches.length} valda` 
                    : "Visa alla"}
                </span>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-4 pb-4">
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
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={districtCollapsibleOpen}
            onOpenChange={setDistrictCollapsibleOpen}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 text-forest p-4">
                <Globe className="h-5 w-5" />
                <h2 className="font-semibold">Distrikt</h2>
                <div className="flex-grow"></div>
                <span className="text-xs">
                  {filters?.districts?.length > 0 
                    ? `${filters.districts.length} valda` 
                    : "Visa alla"}
                </span>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-4 pb-4">
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
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible
            open={disciplineCollapsibleOpen}
            onOpenChange={setDisciplineCollapsibleOpen}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 text-forest p-4">
                <Activity className="h-5 w-5" />
                <h2 className="font-semibold">Discipliner</h2>
                <div className="flex-grow"></div>
                <span className="text-xs">
                  {filters?.disciplines?.length > 0 
                    ? `${filters.disciplines.length} valda` 
                    : "Visa alla"}
                </span>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-4 pb-4">
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
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible
            open={competitionTypeCollapsibleOpen}
            onOpenChange={setCompetitionTypeCollapsibleOpen}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 text-forest p-4">
                <CalendarIcon className="h-5 w-5" />
                <h2 className="font-semibold">Tävlingstyper</h2>
                <div className="flex-grow"></div>
                <span className="text-xs">
                  {filters?.competitionTypes?.length > 0 
                    ? `${filters.competitionTypes.length} valda` 
                    : "Visa alla"}
                </span>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-4 pb-4">
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
            </CollapsibleContent>
          </Collapsible>
          
          <div className="flex items-center justify-center pt-2">
            <Button 
              variant="outline" 
              className="text-forest hover:text-forest-dark"
              onClick={handleResetFilters}
            >
              Återställ alla filter
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
