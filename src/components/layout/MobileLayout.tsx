
import React from 'react';
import TopNavBar from './TopNavBar';
import BottomTabBar from './BottomTabBar';

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  hideBottomTabs?: boolean;
  action?: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false, 
  hideBottomTabs = false,
  action
}) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNavBar 
        title={title} 
        showBackButton={showBackButton} 
        onBack={handleBack}
        action={action}
      />
      
      <main 
        className="flex-grow mobile-page mobile-container"
        style={{
          paddingBottom: !hideBottomTabs ? 'calc(5rem + var(--safe-area-inset-bottom))' : '1rem'
        }}
      >
        {children}
      </main>
      
      {!hideBottomTabs && <BottomTabBar />}
    </div>
  );
};

export default MobileLayout;
