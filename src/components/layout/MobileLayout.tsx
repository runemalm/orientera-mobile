
import React from 'react';
import TopNavBar from './TopNavBar';
import BottomTabBar from './BottomTabBar';
import { useIsMobile } from '../../hooks/use-mobile';

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
  
  const isMobile = useIsMobile();

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
          // Use a safe bottom padding that accounts for the tab bar height and potential safe area insets
          paddingBottom: !hideBottomTabs ? 'calc(4rem + var(--safe-area-inset-bottom, 0px))' : '1rem'
        }}
      >
        {children}
      </main>
      
      {!hideBottomTabs && <BottomTabBar />}
    </div>
  );
};

export default MobileLayout;
