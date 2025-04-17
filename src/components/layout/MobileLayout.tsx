
import React from 'react';
import TopNavBar from './TopNavBar';
import BottomTabBar from './BottomTabBar';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  hideBottomTabs?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false, 
  hideBottomTabs = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/home' || location.pathname === '/';

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNavBar 
        title={title} 
        showBackButton={showBackButton} 
        onBack={handleBack} 
      />
      
      <main 
        className="flex-grow mobile-page mobile-container"
        style={{
          paddingBottom: (!isHomePage && hideBottomTabs) ? '1rem' : 'calc(5rem + var(--safe-area-inset-bottom))'
        }}
      >
        {children}
      </main>
      
      {(!isHomePage && hideBottomTabs) ? null : <BottomTabBar />}
    </div>
  );
};

export default MobileLayout;
