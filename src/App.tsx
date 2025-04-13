
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import CompetitionsPage from './pages/CompetitionsPage';
import InfoPage from './pages/InfoPage';
import ProfilePage from './pages/ProfilePage';
import CompetitionDetailsPage from './pages/CompetitionDetailsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import ClubParticipantsPage from './pages/ClubParticipantsPage';
import CarpoolingPage from './pages/CarpoolingPage';
import DocumentsPage from './pages/DocumentsPage';
import NotFound from './pages/NotFound';

function App() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [showLocationOnboarding, setShowLocationOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has already enabled location
    const hasEnabledLocation = localStorage.getItem('geolocationEnabled');
    
    if (hasEnabledLocation === 'true') {
      setGeolocationEnabled(true);
    } else if (hasEnabledLocation === null) {
      // If this is the first visit, show onboarding
      setShowLocationOnboarding(true);
    }
  }, []);

  const handleLocationEnable = () => {
    localStorage.setItem('geolocationEnabled', 'true');
    setGeolocationEnabled(true);
    setShowLocationOnboarding(false);
  };

  const handleLocationSkip = () => {
    localStorage.setItem('geolocationEnabled', 'false');
    setShowLocationOnboarding(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={
          <LandingPage 
            showLocationOnboarding={showLocationOnboarding}
            onLocationEnable={handleLocationEnable}
            onLocationSkip={handleLocationSkip}
          />
        } />
        <Route path="/competitions" element={<CompetitionsPage geolocationEnabled={geolocationEnabled} />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/competition/:competitionId" element={<CompetitionDetailsPage />} />
        <Route path="/competition/:competitionId/participants" element={<ParticipantsPage />} />
        <Route path="/competition/:competitionId/club-participants" element={<ClubParticipantsPage />} />
        <Route path="/competition/:competitionId/carpooling" element={<CarpoolingPage />} />
        <Route path="/competition/:competitionId/documents" element={<DocumentsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
