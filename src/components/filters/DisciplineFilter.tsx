
import React from 'react';
import { Activity } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from './FilterSection';
import { Discipline } from '@/types';

interface DisciplineFilterProps {
  selectedDisciplines: string[];
  onToggle: (discipline: Discipline) => void;
}

const DisciplineFilter = ({ selectedDisciplines, onToggle }: DisciplineFilterProps) => {
  const allDisciplines = Object.values(Discipline);
  
  // Helper function for translations
  const getDisciplineTranslation = (discipline: Discipline) => {
    const translations: Record<Discipline, string> = {
      [Discipline.Sprint]: 'Sprint',
      [Discipline.Middle]: 'Medel',
      [Discipline.Long]: 'Lång',
      [Discipline.Night]: 'Natt',
      [Discipline.Relay]: 'Stafett',
      [Discipline.UltraLong]: 'Ultra-lång',
      [Discipline.PreO]: 'PreO',
      [Discipline.TempO]: 'TempO',
      [Discipline.Unknown]: 'Okänd' // Added the missing translation for Unknown discipline
    };
    return translations[discipline] || discipline;
  };

  return (
    <FilterSection icon={Activity} title="Discipliner">
      <div className="space-y-2">
        {allDisciplines.map((discipline) => (
          <div key={discipline} className="flex items-center space-x-2">
            <Checkbox 
              id={`discipline-${discipline}`} 
              checked={selectedDisciplines.includes(discipline)}
              onCheckedChange={() => onToggle(discipline)}
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
    </FilterSection>
  );
};

export default DisciplineFilter;
