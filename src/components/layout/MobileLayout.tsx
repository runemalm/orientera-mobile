
import React, { useState, useEffect, useCallback } from 'react';
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
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleBack = () => {
    navigate(-1);
  };
  
  const refreshPage = useCallback(() => {
    window.location.reload();
  }, []);
  
  const handleCornerTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    
    // Check if tap is in the lower right corner (bottom 20%, right 20% of the area)
    if (e.clientY > rect.top + rect.height * 0.8 && e.clientX > rect.left + rect.width * 0.8) {
      const currentTime = Date.now();
      
      // Reset count if it's been more than 2 seconds since last tap
      if (currentTime - lastTapTime > 2000) {
        setTapCount(1);
      } else {
        setTapCount(prevCount => prevCount + 1);
      }
      
      setLastTapTime(currentTime);
      
      // Refresh page after 5 quick taps
      if (tapCount === 4) { // Already at 4, this tap makes it 5
        refreshPage();
        setTapCount(0);
      }
    }
  }, [tapCount, lastTapTime, refreshPage]);

  return (
    <div 
      className="flex flex-col min-h-screen bg-gray-50"
      onClick={handleCornerTap}
    >
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
