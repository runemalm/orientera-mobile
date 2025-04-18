
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft } from 'lucide-react';
import LocationInputForm from '../components/LocationInputForm';
import { useUserLocation } from '../hooks/useUserLocation';

const CompetitionFiltersPage = () => {
  const navigate = useNavigate();
  const { updateUserLocation } = useUserLocation();
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleVisualViewportResize = () => {
        const newKeyboardVisible = window.visualViewport && 
          window.visualViewport.height < window.innerHeight * 0.75;
        setKeyboardVisible(newKeyboardVisible);
      };
      
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleVisualViewportResize);
        return () => {
          window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
        };
      }
    }
  }, []);

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    navigate(-1);
  };

  return (
    <MobileLayout 
      title="Filter" 
      action={
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      }
    >
      <div className={`p-4 ${keyboardVisible ? 'pb-24' : ''}`}>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Plats
            </h2>
            <LocationInputForm 
              onLocationSelected={handleUpdateLocation}
              onCancel={() => navigate(-1)}
            />
          </div>
          
          {/* More filter sections can be added here in the future */}
        </div>
      </div>
    </MobileLayout>
  );
};

export default CompetitionFiltersPage;
