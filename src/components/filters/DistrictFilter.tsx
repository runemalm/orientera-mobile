
import React from 'react';
import { Globe } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from './FilterSection';
import { OrienteeringDistrict } from '@/types';

interface DistrictFilterProps {
  selectedDistricts: string[];
  onToggle: (district: OrienteeringDistrict) => void;
}

const DistrictFilter = ({ selectedDistricts, onToggle }: DistrictFilterProps) => {
  const allDistricts = Object.values(OrienteeringDistrict);
  
  // Helper function for translations
  const getDistrictTranslation = (district: OrienteeringDistrict) => {
    return district.replace(' OF', '');
  };

  return (
    <FilterSection icon={Globe} title="Distrikt" className="h-full">
      <div className="space-y-2 overflow-y-visible">
        {allDistricts.map((district) => (
          <div key={district} className="flex items-center space-x-2">
            <Checkbox 
              id={`district-${district}`} 
              checked={selectedDistricts.includes(district)}
              onCheckedChange={() => onToggle(district)}
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
    </FilterSection>
  );
};

export default DistrictFilter;
