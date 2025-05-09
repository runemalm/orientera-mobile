
import React from 'react';
import TopNavBar from './TopNavBar';
import BottomTabBar from './BottomTabBar';

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  hideBottomTabs?: boolean;
  action?: React.ReactNode;
  leftAction?: React.ReactNode;
  fullHeight?: boolean;
  subtitle?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false, 
  hideBottomTabs = false,
  action,
  leftAction,
  fullHeight = false,
  subtitle
}) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col fixed inset-0 bg-gray-50 overflow-hidden">
      <TopNavBar 
        title={title} 
        showBackButton={showBackButton} 
        onBack={handleBack}
        action={action}
        leftAction={leftAction}
        subtitle={subtitle}
      />
      
      <main 
        className={`flex-grow mobile-container relative ${
          fullHeight ? 'h-full overflow-hidden' : 'overflow-y-auto'
        }`}
        style={{
          paddingTop: '4rem', // Height of TopNavBar
          paddingBottom: !hideBottomTabs ? 'calc(4rem + env(safe-area-inset-bottom, 1rem))' : 'env(safe-area-inset-bottom, 1rem)'
        }}
      >
        {children}
      </main>
      
      {!hideBottomTabs && <BottomTabBar />}
    </div>
  );
};

export default MobileLayout;
