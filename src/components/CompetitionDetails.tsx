import React from 'react';
import { Competition, ResourceType, ResourceFormat } from '../types';
import { Users, Car, FileText, Navigation, BarChart2, Map, Star, Clock, ExternalLink, BookText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translateDiscipline, translateCompetitionType } from '../utils/translations';
import { formatSwedishDate, getDaysRemaining } from '../utils/dateUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';
import FileItem from './FileItem';
import { cn } from '@/lib/utils';
import { getFormattedLocation, hasValidCoordinates } from '../utils/locationUtils';
import { useQuery } from '@tanstack/react-query';

interface CompetitionDetailsProps {
  competition: Competition;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({ competition }) => {
  const formattedDate = formatSwedishDate(competition.date, 'EEEE d MMMM yyyy');
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteCompetitions', []);
  
  const safetyFavorites = Array.isArray(favorites) ? favorites : [];
  const isFavorite = safetyFavorites.includes(competition.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const storedFavoritesString = window.localStorage.getItem('favoriteCompetitions');
    const currentFavorites = storedFavoritesString ? 
      (JSON.parse(storedFavoritesString) || []) : 
      [];
    
    const safeCurrentFavorites = Array.isArray(currentFavorites) ? currentFavorites : [];
    
    let newFavorites: string[];
    const isCurrentlyFavorite = safeCurrentFavorites.includes(competition.id);
    
    if (isCurrentlyFavorite) {
      newFavorites = safeCurrentFavorites.filter(id => id !== competition.id);
    } else {
      newFavorites = [...safeCurrentFavorites, competition.id];
    }
    
    console.log('CompetitionDetails - Toggling favorite:', {
      competitionId: competition.id,
      wasInFavorites: isCurrentlyFavorite,
      oldFavorites: safeCurrentFavorites,
      newFavorites: newFavorites
    });
    
    setFavorites(newFavorites);
  };

  const daysRemaining = getDaysRemaining(competition.date);
  
  const getStatusInfo = () => {
    if (daysRemaining > 7) {
      return { 
        color: "bg-gray-100 text-gray-700",
        text: `${daysRemaining} dagar kvar`
      };
    } else if (daysRemaining > 1) {
      return {
        color: "bg-blue-100 text-blue-700", 
        text: `${daysRemaining} dagar kvar`
      };
    } else if (daysRemaining === 1) {
      return {
        color: "bg-blue-200 text-blue-800",
        text: "Imorgon"
      };
    } else if (daysRemaining === 0) {
      return {
        color: "bg-green-100 text-green-700",
        text: "Idag"
      };
    } else {
      const daysSince = Math.abs(daysRemaining);
      const daysText = daysSince === 1 ? "dag" : "dagar";
      return {
        color: "bg-gray-100 text-gray-500",
        text: `${daysSince} ${daysText} sedan`
      };
    }
  };

  const status = getStatusInfo();
  
  const invitation = competition.resources?.find(r => r.type === ResourceType.Invitation);
  const pm = competition.resources?.find(r => r.type === ResourceType.PM);
  const results = competition.resources?.filter(r => 
    r.type === ResourceType.Results || 
    r.type === ResourceType.Splits
  );

  const formattedLocation = getFormattedLocation(
    competition.location,
    null,
    null
  );

  const directionsUrl = hasValidCoordinates(competition.latitude, competition.longitude)
    ? `https://www.google.com/maps/dir/?api=1&destination=${competition.latitude},${competition.longitude}`
    : null;

  const otherResources = competition.resources?.filter(r =>
    r.type !== ResourceType.Results &&
    r.type !== ResourceType.Splits &&
    r.type !== ResourceType.Invitation &&
    r.type !== ResourceType.PM
  );

  const { data: availableSeats = 0 } = useQuery({
    queryKey: ['carpooling-seats', competition.id],
    queryFn: async () => {
      return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-primary text-white p-5 rounded-lg shadow-md relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary-foreground/10"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-primary-foreground/10"></div>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{competition.name}</h2>
            <p className="text-sm text-white/80">{competition.club}</p>
          </div>
          <button 
            onClick={toggleFavorite}
            className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
          >
            <Star
              size={24}
              className={cn(
                "transition-colors",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white/80"
              )}
            />
          </button>
        </div>
        
        <div className="mt-3 flex items-center gap-2 relative z-10">
          <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
            <Clock size={14} />
            {status.text}
          </div>
          <div className="inline-flex bg-white/20 px-3 py-1 rounded-full text-sm">
            {translateCompetitionType(competition.competitionType)} • {translateDiscipline(competition.discipline)}
          </div>
        </div>
      </div>

      {(invitation || pm) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BookText className="text-forest" size={20} />
              <h3 className="font-semibold">Tävlingsinformation</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {invitation && (
              <div>
                <Link
                  key={invitation.id}
                  to={invitation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-forest" />
                    <span className="font-medium">{invitation.name}</span>
                  </div>
                  <div className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </Link>
              </div>
            )}
            {pm && (
              <div>
                <Link
                  key={pm.id}
                  to={pm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-forest" />
                    <span className="font-medium">{pm.name}</span>
                  </div>
                  <div className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users className="text-forest" size={20} />
            <h3 className="font-semibold">Deltagare och samåkning</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <Link 
            to={`/competition/${competition.id}/participants`}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Users size={20} className="text-forest" />
              <span className="font-medium">Anmälda deltagare</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{competition.participantCount || 0}</span>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </div>
          </Link>
          
          <Link 
            to={`/competition/${competition.id}/club-participants`}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Users size={20} className="text-blue-600" />
              <span className="font-medium">Klubbanmälda</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{competition.clubParticipantCount || 0}</span>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </div>
          </Link>
          
          <Link 
            to={`/competition/${competition.id}/carpooling`}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Car size={20} className="text-forest" />
              <span className="font-medium">Samåkning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{availableSeats}</span>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </div>
          </Link>

          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <Navigation size={20} className="text-forest" />
                <span className="font-medium">Vägbeskrivning</span>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </a>
          )}

          {hasValidCoordinates(competition.latitude, competition.longitude) && (
            <Link 
              to={`/competition/${competition.id}/map`}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <Map size={20} className="text-forest" />
                <span className="font-medium">Visa arenan på kartan</span>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </Link>
          )}

          {otherResources && otherResources.map((resource) => (
            <div key={resource.id}>
              <FileItem file={resource} />
            </div>
          ))}
        </div>
      </div>

      {(results?.length > 0 || competition.liveloxLink) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="text-forest" size={20} />
              <h3 className="font-semibold">Resultat och analys</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {results?.map((result) => (
              <div key={result.id}>
                <FileItem file={result} />
              </div>
            ))}
            {competition.liveloxLink && (
              <a
                href={competition.liveloxLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink size={20} className="text-forest" />
                  <span className="font-medium">Banor och rutter på Livelox</span>
                </div>
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionDetails;
