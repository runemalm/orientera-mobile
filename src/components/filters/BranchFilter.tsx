
import React from 'react';
import { Footprints } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from './FilterSection';
import { Branch } from '@/types';

interface BranchFilterProps {
  selectedBranches: Branch[];
  onToggle: (branch: Branch) => void;
}

const BranchFilter = ({ selectedBranches, onToggle }: BranchFilterProps) => {
  const allBranches = Object.values(Branch);
  
  // Helper function for translations
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

  return (
    <FilterSection icon={Footprints} title="Gren">
      <div className="space-y-2">
        {allBranches.map((branch) => (
          <div key={branch} className="flex items-center space-x-2">
            <Checkbox 
              id={`branch-${branch}`} 
              checked={selectedBranches.includes(branch)}
              onCheckedChange={() => onToggle(branch)}
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
    </FilterSection>
  );
};

export default BranchFilter;
