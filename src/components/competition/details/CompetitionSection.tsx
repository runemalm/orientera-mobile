
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompetitionSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const CompetitionSection: React.FC<CompetitionSectionProps> = ({ 
  icon: Icon,
  title,
  children,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-100", className)}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Icon className="text-forest" size={20} />
          <h3 className="font-semibold">{title}</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
};

export default CompetitionSection;

