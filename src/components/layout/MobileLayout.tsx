
import React from 'react';
import TopNavBar from './TopNavBar';
import BottomTabBar from './BottomTabBar';

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  hideBottomTabs?: boolean;
  action?: React.ReactNode;
  fullHeight?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false, 
  hideBottomTabs = false,
  action,
  fullHeight = false
}) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col fixed inset-0 bg-gray-50">
      <TopNavBar 
        title={title} 
        showBackButton={showBackButton} 
        onBack={handleBack}
        action={action}
      />
      
      <main 
        className={`flex-grow overflow-auto`}
        style={{
          paddingTop: '4rem', // Height of TopNavBar
          paddingBottom: !hideBottomTabs ? 'calc(4rem + var(--safe-area-inset-bottom))' : '1rem'
        }}
      >
        {children}
      </main>
      
      {!hideBottomTabs && <BottomTabBar />}
    </div>
  );
};

export default MobileLayout;
