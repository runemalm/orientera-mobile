
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { Activity, CalendarRange, Calendar as CalendarIcon, Globe } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { 
  OrienteeringDistrict, 
  Discipline, 
  CompetitionType,
  Branch,
  Filter 
} from '../../../types';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface CalendarFiltersProps {
  filters: Filter;
  onFiltersChange: (filters: Filter) => void;
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [dateRangeCollapsibleOpen, setDateRangeCollapsibleOpen] = React.useState(false);
  const [branchCollapsibleOpen, setBranchCollapsibleOpen] = React.useState(false);
  const [districtCollapsibleOpen, setDistrictCollapsibleOpen] = React.useState(false);
  const [disciplineCollapsibleOpen, setDisciplineCollapsibleOpen] = React.useState(false);
  const [competitionTypeCollapsibleOpen, setCompetitionTypeCollapsibleOpen] = React.useState(false);

  const allBranches = Object.values(Branch);
  const allDistricts = Object.values(OrienteeringDistrict);
  const allDisciplines = Object.values(Discipline);
  const allCompetitionTypes = Object.values(CompetitionType);

  const hasDateFilter = Boolean(filters?.dateRange?.from || filters?.dateRange?.to);

  const handleDateRangeChange = (date: Date | undefined, type: 'from' | 'to') => {
    const currentDateRange = filters?.dateRange || { from: null, to: null };
    onFiltersChange({
      ...filters,
      dateRange: {
        ...currentDateRange,
        [type]: date || null
      }
    });
  };

  const handleBranchToggle = (branch: Branch) => {
    if (filters.branches.includes(branch)) {
      onFiltersChange({
        ...filters,
        branches: filters.branches.filter(b => b !== branch)
      });
    } else {
      onFiltersChange({
        ...filters,
        branches: [...filters.branches, branch]
      });
    }
  };

  const handleDistrictToggle = (district: OrienteeringDistrict) => {
    if (filters.districts.includes(district)) {
      onFiltersChange({
        ...filters,
        districts: filters.districts.filter(d => d !== district)
      });
    } else {
      onFiltersChange({
        ...filters,
        districts: [...filters.districts, district]
      });
    }
  };

  const handleDisciplineToggle = (discipline: Discipline) => {
    if (filters.disciplines.includes(discipline)) {
      onFiltersChange({
        ...filters,
        disciplines: filters.disciplines.filter(d => d !== discipline)
      });
    } else {
      onFiltersChange({
        ...filters,
        disciplines: [...filters.disciplines, discipline]
      });
    }
  };

  const handleCompetitionTypeToggle = (type: CompetitionType) => {
    if (filters.competitionTypes.includes(type)) {
      onFiltersChange({
        ...filters,
        competitionTypes: filters.competitionTypes.filter(t => t !== type)
      });
    } else {
      onFiltersChange({
        ...filters,
        competitionTypes: [...filters.competitionTypes, type]
      });
    }
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
    <div className="space-y-6">
      <Collapsible
        open={dateRangeCollapsibleOpen}
        onOpenChange={setDateRangeCollapsibleOpen}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 text-forest p-4">
          <CalendarRange className="h-5 w-5" />
          <h2 className="font-semibold">Datumintervall</h2>
          <div className="flex-grow"></div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <span className="text-xs">
                {hasDateFilter ? 'Aktivt filter' : 'Visa alla'}
              </span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
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
        <div className="flex items-center gap-2 text-forest p-4">
          <Activity className="h-5 w-5" />
          <h2 className="font-semibold">Gren</h2>
          <div className="flex-grow"></div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <span className="text-xs">
                {filters?.branches?.length > 0 
                  ? `${filters.branches.length} valda` 
                  : "Visa alla"}
              </span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="px-4 pb-4 space-y-2">
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
        <div className="flex items-center gap-2 text-forest p-4">
          <Globe className="h-5 w-5" />
          <h2 className="font-semibold">Distrikt</h2>
          <div className="flex-grow"></div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <span className="text-xs">
                {filters?.districts?.length > 0 
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
        <div className="flex items-center gap-2 text-forest p-4">
          <Activity className="h-5 w-5" />
          <h2 className="font-semibold">Discipliner</h2>
          <div className="flex-grow"></div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <span className="text-xs">
                {filters?.disciplines?.length > 0 
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
        <div className="flex items-center gap-2 text-forest p-4">
          <CalendarIcon className="h-5 w-5" />
          <h2 className="font-semibold">Tävlingstyper</h2>
          <div className="flex-grow"></div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <span className="text-xs">
                {filters?.competitionTypes?.length > 0 
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
    </div>
  );
};

export default CalendarFilters;
