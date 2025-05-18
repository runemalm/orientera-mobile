
import React from 'react';
import { CompetitionSummary } from '../../types';
import CompetitionsMap from './CompetitionsMap';

interface CompetitionsMapViewProps {
  competitions: CompetitionSummary[];
}

const CompetitionsMapView: React.FC<CompetitionsMapViewProps> = ({ competitions }) => {
  // Filter competitions to only include those with coordinates
  const competitionsWithCoordinates = competitions.filter(
    comp => comp.latitude && comp.longitude
  );
  
  // Display message if no competitions have coordinates
  if (competitionsWithCoordinates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
        <div className="bg-yellow-50 rounded-full p-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold">Inga tävlingar att visa</h2>
        <p className="text-gray-500 mt-2">
          {competitions.length > 0 
            ? 'Inga av tävlingarna har platskoordinater att visa på kartan.'
            : 'Det finns inga tävlingar att visa.'}
        </p>
      </div>
    );
  }

  // If there are competitions with coordinates, show the map
  return (
    <div className="h-full w-full px-0">
      {competitionsWithCoordinates.length < competitions.length && (
        <div className="bg-yellow-50 px-4 py-2 text-sm mb-2">
          <p>
            Visar {competitionsWithCoordinates.length} av {competitions.length} tävlingar på kartan.
            {competitions.length - competitionsWithCoordinates.length} tävlingar saknar koordinater och visas inte.
          </p>
        </div>
      )}
      <div className="h-[calc(100%-2px)] -mx-2 relative">
        <CompetitionsMap competitions={competitionsWithCoordinates} />
      </div>
    </div>
  );
};

export default CompetitionsMapView;
