
import React from 'react';
import { Trophy } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from './FilterSection';
import { CompetitionType } from '@/types';

interface CompetitionTypeFilterProps {
  selectedTypes: CompetitionType[];
  onToggle: (type: CompetitionType) => void;
}

const CompetitionTypeFilter = ({ selectedTypes, onToggle }: CompetitionTypeFilterProps) => {
  const allCompetitionTypes = Object.values(CompetitionType);
  
  // Helper function for translations
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
    <FilterSection icon={Trophy} title="Tävlingstyper">
      <div className="space-y-2">
        {allCompetitionTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox 
              id={`type-${type}`} 
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => onToggle(type)}
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
    </FilterSection>
  );
};

export default CompetitionTypeFilter;
