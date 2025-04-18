import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CompetitionsPage from './pages/CompetitionsPage';
import HomePage from './pages/HomePage';
import LocationOnboarding from './components/LocationOnboarding';
import { useLocalStorage } from './hooks/useLocalStorage';
import ProfilePage from './pages/ProfilePage';
import CompetitionDetailsPage from './pages/CompetitionDetailsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import ClubParticipantsPage from './pages/ClubParticipantsPage';
import CarpoolingPage from './pages/CarpoolingPage';
import SettingsPage from './pages/SettingsPage';

const App = () => {
  const [hasLocation, setHasLocation] = useLocalStorage<boolean>('userLocation', false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={hasLocation ? <Navigate to="/home" /> : <LocationOnboarding isOpen={!hasLocation} onComplete={() => setHasLocation(true)} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/competition/:competitionId" element={<CompetitionDetailsPage />} />
        <Route path="/competition/:competitionId/participants" element={<ParticipantsPage />} />
        <Route path="/competition/:competitionId/club-participants" element={<ClubParticipantsPage />} />
        <Route path="/competition/:competitionId/carpooling" element={<CarpoolingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
