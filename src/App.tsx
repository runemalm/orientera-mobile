import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIsMobile } from "./hooks/use-mobile";
import LandingPage from "./pages/LandingPage";
import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionDetailsPage from "./pages/CompetitionDetailsPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import ClubParticipantsPage from "./pages/ClubParticipantsPage";
import StartTimesPage from "./pages/StartTimesPage";
import DocumentsPage from "./pages/DocumentsPage";
import CarpoolingPage from "./pages/CarpoolingPage";
import NotFound from "./pages/NotFound";
import InfoPage from "./pages/InfoPage";
import SettingsPage from "./pages/SettingsPage";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const KeyboardShortcutHandler = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [touchCount, setTouchCount] = useState(0);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  
  const resetUserLocation = () => {
    localStorage.removeItem('userLocation');
  };
  
  const navigateAndResetLocation = () => {
    resetUserLocation();
    navigate('/landing');
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'l') {
        navigateAndResetLocation();
      }
    };
    
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      if (touch.clientX > screenWidth * 0.8 && touch.clientY < screenHeight * 0.1) {
        const currentTime = new Date().getTime();
        const timeSinceLastTouch = currentTime - lastTouchTime;
        
        if (timeSinceLastTouch > 1500) {
          setTouchCount(1);
        } else {
          setTouchCount(prev => prev + 1);
        }
        
        const newCount = timeSinceLastTouch <= 1500 ? touchCount + 1 : 1;
        if (newCount === 3 || newCount === 5) {
          navigateAndResetLocation();
          setTouchCount(0);
        }
        
        setLastTouchTime(currentTime);
      } else {
        setTouchCount(0);
      }
    };
    
    const handleMouseClick = (event: MouseEvent) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      if (event.clientX > screenWidth * 0.8 && event.clientY < screenHeight * 0.1) {
        const currentTime = new Date().getTime();
        const timeSinceLastClick = currentTime - lastClickTime;
        
        if (timeSinceLastClick > 1500) {
          setClickCount(1);
        } else {
          setClickCount(prev => prev + 1);
        }
        
        const newCount = timeSinceLastClick <= 1500 ? clickCount + 1 : 1;
        if (newCount === 3 || newCount === 5) {
          navigateAndResetLocation();
          setClickCount(0);
        }
        
        setLastClickTime(currentTime);
      } else {
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
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/competition/:competitionId" element={<CompetitionDetailsPage />} />
        <Route path="/competition/:competitionId/participants" element={<ParticipantsPage />} />
        <Route path="/competition/:competitionId/club-participants" element={<ClubParticipantsPage />} />
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
