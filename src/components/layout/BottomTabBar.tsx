
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Info } from 'lucide-react';
import { TabName } from '../../types';

const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs: { name: TabName; icon: React.ReactNode; label: string; path: string }[] = [
    {
      name: 'competitions',
      icon: <MapPin size={24} />,
      label: 'Tävlingar',
      path: '/competitions'
    },
    {
      name: 'info',
      icon: <Info size={24} />,
      label: 'Om',
      path: '/info'
    }
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="bottom-tabs flex items-center justify-around">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`flex flex-col items-center justify-center w-full h-full ${
            (currentPath === tab.path || 
             (tab.path === '/competitions' && currentPath === '/')) // Consider "/" as competitions too
              ? 'text-primary font-medium'
              : 'text-gray-500'
          }`}
          onClick={() => handleTabClick(tab.path)}
        >
          <div className="flex items-center justify-center">
            {tab.icon}
          </div>
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomTabBar;
