
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIsMobile } from "./hooks/use-mobile";
import LandingPage from "./pages/LandingPage";
import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionDetailsPage from "./pages/CompetitionDetailsPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import StartTimesPage from "./pages/StartTimesPage";
import DocumentsPage from "./pages/DocumentsPage";
import CarpoolingPage from "./pages/CarpoolingPage";
import NotFound from "./pages/NotFound";
import InfoPage from "./pages/InfoPage";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Hidden keyboard shortcut handler component
const KeyboardShortcutHandler = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [touchCount, setTouchCount] = useState(0);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  
  const resetUserLocation = () => {
    // Reset the user location in localStorage
    localStorage.removeItem('userLocation');
  };
  
  const navigateAndResetLocation = () => {
    // Reset location and then navigate to landing page
    resetUserLocation();
    navigate('/landing');
  };
  
  useEffect(() => {
    // Keyboard shortcut for desktop
    const handleKeyDown = (event: KeyboardEvent) => {
      // Secret key combo: Ctrl + Alt + L (for Landing)
      if (event.ctrlKey && event.altKey && event.key === 'l') {
        navigateAndResetLocation();
      }
    };
    
    // Touch gesture for mobile - sequential touches in top right corner
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Check if touch is in top right corner (top 10%, right 20% of screen)
      if (touch.clientX > screenWidth * 0.8 && touch.clientY < screenHeight * 0.1) {
        const currentTime = new Date().getTime();
        const timeSinceLastTouch = currentTime - lastTouchTime;
        
        // If more than 1.5 seconds between touches, reset counter
        if (timeSinceLastTouch > 1500) {
          setTouchCount(1); // Start with 1 for this touch
        } else {
          // Only increment if it's a quick consecutive touch
          setTouchCount(prev => prev + 1);
        }
        
        // Check for activation only on exact counts (3 or 5)
        const newCount = timeSinceLastTouch <= 1500 ? touchCount + 1 : 1;
        if (newCount === 3 || newCount === 5) {
          navigateAndResetLocation();
          // Reset counter after activation
          setTouchCount(0);
        }
        
        // Always update the last touch time
        setLastTouchTime(currentTime);
      } else {
        // Touch outside target area, reset counter
        setTouchCount(0);
      }
    };
    
    // Mouse click handler for desktop web
    const handleMouseClick = (event: MouseEvent) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Check if click is in top right corner (top 10%, right 20% of screen)
      if (event.clientX > screenWidth * 0.8 && event.clientY < screenHeight * 0.1) {
        const currentTime = new Date().getTime();
        const timeSinceLastClick = currentTime - lastClickTime;
        
        // If more than 1.5 seconds between clicks, reset counter
        if (timeSinceLastClick > 1500) {
          setClickCount(1); // Start with 1 for this click
        } else {
          // Only increment if it's a quick consecutive click
          setClickCount(prev => prev + 1);
        }
        
        // Check for activation only on exact counts (3 or 5)
        const newCount = timeSinceLastClick <= 1500 ? clickCount + 1 : 1;
        if (newCount === 3 || newCount === 5) {
          navigateAndResetLocation();
          // Reset counter after activation
          setClickCount(0);
        }
        
        // Always update the last click time
        setLastClickTime(currentTime);
      } else {
        // Click outside target area, reset counter
        setClickCount(0);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleMouseClick);
    
    if (isMobile) {
      window.addEventListener('touchstart', handleTouchStart);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleMouseClick);
      
      if (isMobile) {
        window.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [navigate, isMobile, touchCount, lastTouchTime, clickCount, lastClickTime]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/index" element={<Index />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/competition/:competitionId" element={<CompetitionDetailsPage />} />
        <Route path="/competition/:competitionId/participants" element={<ParticipantsPage />} />
        <Route path="/competition/:competitionId/start-times" element={<StartTimesPage />} />
        <Route path="/competition/:competitionId/documents" element={<DocumentsPage />} />
        <Route path="/competition/:competitionId/carpooling" element={<CarpoolingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <KeyboardShortcutHandler />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
