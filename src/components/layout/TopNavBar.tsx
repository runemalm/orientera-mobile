
import React from 'react';
import { MapPin } from 'lucide-react';

interface TopNavBarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ title, showBackButton = false, onBack }) => {
  return (
    <div className="top-nav flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <button 
            onClick={onBack} 
            className="w-8 h-8 flex items-center justify-center text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center text-primary">
            <MapPin size={24} />
          </div>
        )}
        <h1 className="text-lg font-semibold">{title || "Orientera.com"}</h1>
      </div>
      
      {/* Menu button removed */}
    </div>
  );
};

export default TopNavBar;
