
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionDetailsPage from "./pages/CompetitionDetailsPage";
import NotFound from "./pages/NotFound";
import InfoPage from "./pages/InfoPage";

const queryClient = new QueryClient();

// Hidden keyboard shortcut handler component
const KeyboardShortcutHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Secret key combo: Ctrl + Alt + L (for Landing)
      if (event.ctrlKey && event.altKey && event.key === 'l') {
        navigate('/landing');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
  
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
