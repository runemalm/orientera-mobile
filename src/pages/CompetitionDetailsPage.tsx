
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionDetails from '../components/CompetitionDetails';
import { Competition } from '../types';
import { AlertCircle, Share2, Trophy } from 'lucide-react';
import { getCompetitionById } from '../services/api';
import { Button } from '@/components/ui/button';
import { formatSwedishDate } from '../utils/dateUtils';

const CompetitionDetailsPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!competition) return;
    
    setIsSharing(true);
    
    const shareMessage = `Kolla in ${competition.name} - en ${competition.discipline.toLowerCase()}tävling anordnad av ${competition.club}!\n\nDatum: ${formatSwedishDate(competition.date, 'EEEE d MMMM yyyy')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: competition.name,
          text: shareMessage,
          url: window.location.href
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        const textToCopy = `${shareMessage}\n\n${window.location.href}`;
        await navigator.clipboard.writeText(textToCopy);
        console.log('Competition details copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      } finally {
        setIsSharing(false);
      }
    }
  };

  const fetchCompetition = async () => {
    if (!competitionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCompetitionById(competitionId);
      setCompetition(data);
    } catch (err) {
      console.error('Error fetching competition details:', err);
      setError('Det gick inte att hämta tävlingsinformation. Försök igen senare.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetition();
  }, [competitionId]);

  if (loading) {
    return (
      <MobileLayout title="Laddar..." showBackButton>
        <div className="flex flex-col justify-center items-center h-64 mt-4 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Hämtar tävlingsinformation...</p>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout title="Fel" showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-8 px-4 text-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Ett fel uppstod</h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={fetchCompetition}
          >
            Försök igen
          </Button>
        </div>
      </MobileLayout>
    );
  }

  if (!competition) {
    return (
      <MobileLayout title="Hittades inte" showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-8 px-4 text-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <Trophy size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Tävlingen hittades inte</h2>
          <p className="text-gray-500 mt-2">Vi kunde tyvärr inte hitta den tävling du söker.</p>
        </div>
      </MobileLayout>
    );
  }

  const shareButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      className="text-muted-foreground"
      disabled={isSharing}
    >
      <Share2 className="h-5 w-5" />
    </Button>
  );

  return (
    <MobileLayout 
      title={competition.name} 
      showBackButton 
      action={shareButton}
    >
      <div className="pb-4">
        <CompetitionDetails competition={competition} />
      </div>
    </MobileLayout>
  );
};

export default CompetitionDetailsPage;
