import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Info, Home, User } from 'lucide-react';
import { TabName } from '../../types';

const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCompetitionRelated = currentPath.startsWith('/competition/');

  const tabs: { name: TabName; icon: React.ReactNode; label: string; path: string }[] = [
    {
      name: 'home',
      icon: <Home size={24} />,
      label: 'Hem',
      path: '/home'
    },
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
    },
    {
      name: 'profile',
      icon: <User size={24} />,
      label: 'Profil',
      path: '/profile'
    }
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="bottom-tabs fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white border-t border-gray-200 z-10">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`flex flex-col items-center justify-center w-full py-2 ${
            (tab.name === 'competitions' && (currentPath === '/competitions' || isCompetitionRelated)) ||
            (tab.path === currentPath)
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
