
import React from 'react';
import { cn } from "@/lib/utils";

interface CompetitionDetailSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  borderless?: boolean;
}

const CompetitionDetailSection: React.FC<CompetitionDetailSectionProps> = ({ 
  icon, 
  title, 
  children,
  className,
  borderless = false
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden",
      className
    )}>
      <div className={cn("p-3", !borderless && "border-b border-gray-100")}>
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
};

export default CompetitionDetailSection;
