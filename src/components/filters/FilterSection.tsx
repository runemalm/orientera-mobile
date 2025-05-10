
import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FilterSectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}

const FilterSection = ({ icon: Icon, title, children, className = '' }: FilterSectionProps) => {
  return (
    <section className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
      <div className="flex items-center gap-2 text-forest mb-4">
        <Icon className="h-5 w-5" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
};

export default FilterSection;
