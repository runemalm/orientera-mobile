
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIsMobile } from "./hooks/use-mobile";
import LandingPage from "./pages/LandingPage";
import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionDetailsPage from "./pages/CompetitionDetailsPage";
import NotFound from "./pages/NotFound";
import InfoPage from "./pages/InfoPage";

const queryClient = new QueryClient();

// Hidden keyboard shortcut handler component
const KeyboardShortcutHandler = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [touchCount, setTouchCount] = useState(0);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  
  useEffect(() => {
    // Keyboard shortcut for desktop
    const handleKeyDown = (event: KeyboardEvent) => {
      // Secret key combo: Ctrl + Alt + L (for Landing)
      if (event.ctrlKey && event.altKey && event.key === 'l') {
        navigate('/landing');
      }
    };
    
    // Touch gesture for mobile - triple tap in top right corner
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Check if touch is in top right corner (top 10%, right 20% of screen)
      if (touch.clientX > screenWidth * 0.8 && touch.clientY < screenHeight * 0.1) {
        const currentTime = new Date().getTime();
        
        // Reset count if it's been more than 1.5 seconds since last touch
        if (currentTime - lastTouchTime > 1500) {
          setTouchCount(1);
        } else {
          setTouchCount(prev => prev + 1);
        }
        
        setLastTouchTime(currentTime);
        
        // Navigate to landing page after 3 quick taps
        if (touchCount === 2) {
          navigate('/landing');
          setTouchCount(0);
        }
      }
    };
    
    // Mouse click handler for desktop web - triple click in top right corner
    const handleMouseClick = (event: MouseEvent) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Check if click is in top right corner (top 10%, right 20% of screen)
      if (event.clientX > screenWidth * 0.8 && event.clientY < screenHeight * 0.1) {
        const currentTime = new Date().getTime();
        
        // Reset count if it's been more than 1.5 seconds since last click
        if (currentTime - lastClickTime > 1500) {
          setClickCount(1);
        } else {
          setClickCount(prev => prev + 1);
        }
        
        setLastClickTime(currentTime);
        
        // Navigate to landing page after 3 quick clicks
        if (clickCount === 2) {
          navigate('/landing');
          setClickCount(0);
        }
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CompetitionsPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/competition/:competitionId" element={<CompetitionDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <KeyboardShortcutHandler />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
