
import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarRange, Home, Star, Sparkles, UserRound } from 'lucide-react';
import { TabName } from '../../types';

const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCompetitionRelated = 
    currentPath === '/competitions' || 
    currentPath.startsWith('/competition/') ||
    currentPath === '/manual-filtering' || 
    currentPath === '/ai-filtering' ||
    currentPath === '/competitions/map';
    
  const isHome = currentPath === '/home' || currentPath === '/';

  // Include favorites page in the list of paths
  const isFavoritesRelated = currentPath === '/favorites';
  
  // Include profile page in the list of paths
  const isProfileRelated = currentPath === '/profile';
  
  const tabs: { name: TabName; icon: React.ReactNode; label: string; path: string }[] = [
    {
      name: 'home',
      icon: <Home size={24} />,
      label: 'Hem',
      path: '/home'
    },
    {
      name: 'assistant',
      icon: <Sparkles size={24} />,
      label: 'Assistent',
      path: '/assistant'
    },
    {
      name: 'competitions',
      icon: <CalendarRange size={24} />,
      label: 'Tävlingar',
      path: '/competitions'
    },
    {
      name: 'favorites',
      icon: <Star size={24} />,
      label: 'Favoriter',
      path: '/favorites'
    },
    {
      name: 'profile',
      icon: <UserRound size={24} />,
      label: 'Profil',
      path: '/profile'
    }
  ];

  const handleTabClick = useCallback((path: string) => {
    if (path !== currentPath) {
      navigate(path);
    }
  }, [navigate, currentPath]);

  return (
    <div className="bottom-tabs fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white border-t border-gray-200 z-40">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`flex flex-col items-center justify-center w-full py-2 ${
            (tab.name === 'competitions' && isCompetitionRelated) ||
            (tab.name === 'home' && isHome) ||
            (tab.name === 'favorites' && isFavoritesRelated) ||
            (tab.name === 'profile' && isProfileRelated) ||
            (tab.path === currentPath && 
              tab.name !== 'home' && 
              tab.name !== 'competitions' &&
              tab.name !== 'favorites' &&
              tab.name !== 'profile')
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
