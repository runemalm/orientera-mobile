import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CompetitionsPage from './pages/CompetitionsPage';
import LocationOnboarding from './components/LocationOnboarding';
import { useLocalStorage } from './hooks/useLocalStorage';
import CompetitionFiltersPage from './pages/CompetitionFiltersPage';

const App = () => {
  const [hasLocation, setHasLocation] = useLocalStorage('userLocation');

  return (
    <Router>
      <Routes>
        <Route path="/" element={hasLocation ? <CompetitionsPage /> : <LocationOnboarding isOpen={!hasLocation} onComplete={() => setHasLocation(true)} />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="/competitions/filters" element={<CompetitionFiltersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
