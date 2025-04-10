
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, User } from 'lucide-react';
import { TabName } from '../../types';

const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs: { name: TabName; icon: React.ReactNode; label: string; path: string }[] = [
    {
      name: 'competitions',
      icon: <MapPin size={24} />,
      label: 'Events',
      path: '/'
    },
    {
      name: 'profile',
      icon: <User size={24} />,
      label: 'Profile',
      path: '/profile'
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
            currentPath === tab.path
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
