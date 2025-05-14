
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CompetitionsPage from './pages/CompetitionsPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import CompetitionDetailsPage from './pages/CompetitionDetailsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import ClubParticipantsPage from './pages/ClubParticipantsPage';
import CarpoolingPage from './pages/CarpoolingPage';
import SettingsPage from './pages/SettingsPage';
import CompetitionMapPage from './pages/CompetitionMapPage';
import CompetitionsMapPage from './pages/CompetitionsMapPage';
import NotFound from './pages/NotFound';
import FavoritesPage from './pages/FavoritesPage';
import AssistantPage from './pages/AssistantPage';
import AiFilteringPage from './pages/AiFilteringPage';
import ManualFilterPage from './pages/ManualFilterPage';
import ComingSoonPage from './pages/ComingSoonPage';
import { useVersionCheck } from './hooks/useVersionCheck';

const App = () => {
  // Initialize version checker (will auto-update when needed)
  useVersionCheck();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="/competitions/map" element={<CompetitionsMapPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/competition/:competitionId" element={<CompetitionDetailsPage />} />
        <Route path="/competition/:competitionId/participants" element={<ParticipantsPage />} />
        <Route path="/competition/:competitionId/club-participants" element={<ClubParticipantsPage />} />
        <Route path="/competition/:competitionId/carpooling" element={<CarpoolingPage />} />
        <Route path="/competition/:competitionId/map" element={<CompetitionMapPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/ai-filtering" element={<AiFilteringPage />} />
        <Route path="/manual-filtering" element={<ManualFilterPage />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
