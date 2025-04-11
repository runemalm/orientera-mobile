
import React, { useEffect, useRef } from 'react';
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
  const prevPathRef = useRef<string | null>(null);

  // Effect to scroll to top only on initial page load or when navigating to a new page
  useEffect(() => {
    // If it's a new page (not just a parameter change on the same page)
    if (prevPathRef.current !== location.pathname) {
      window.scrollTo(0, 0);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

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
          paddingBottom: hideBottomTabs ? '1rem' : 'calc(5rem + var(--safe-area-inset-bottom))'
        }}
      >
        {children}
      </main>
      
      {!hideBottomTabs && <BottomTabBar />}
    </div>
  );
};

export default MobileLayout;
