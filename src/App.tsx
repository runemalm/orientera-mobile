
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CompetitionsPage from './pages/CompetitionsPage';
import HomePage from './pages/HomePage';
import LocationOnboarding from './components/LocationOnboarding';
import { useLocalStorage } from './hooks/useLocalStorage';
import CompetitionFiltersPage from './pages/CompetitionFiltersPage';
import ProfilePage from './pages/ProfilePage';
import CompetitionDetailsPage from './pages/CompetitionDetailsPage';

const App = () => {
  const [hasLocation, setHasLocation] = useLocalStorage<boolean>('userLocation', false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={hasLocation ? <Navigate to="/home" /> : <LocationOnboarding isOpen={!hasLocation} onComplete={() => setHasLocation(true)} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="/competitions/filters" element={<CompetitionFiltersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/competition/:competitionId" element={<CompetitionDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
