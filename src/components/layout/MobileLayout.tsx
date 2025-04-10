
import React from 'react';
import TopNavBar from './TopNavBar';
import BottomTabBar from './BottomTabBar';
import { useNavigate } from 'react-router-dom';

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
      
      <main className={`flex-grow mobile-container ${hideBottomTabs ? 'pb-6' : 'pb-[calc(5rem+env(safe-area-inset-bottom,0px))]'}`}>
        {children}
      </main>
      
      {!hideBottomTabs && <BottomTabBar />}
    </div>
  );
};

export default MobileLayout;
