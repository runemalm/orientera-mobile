import { useState, useEffect } from 'react';

export interface UserLocation {
  city: string;
  latitude: number;
  longitude: number;
}

const DEFAULT_LOCATION = {
  city: 'Kalmar',
  latitude: 56.6784,  // Latitude of Kalmar
  longitude: 16.3620  // Longitude of Kalmar
};

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setUserLocation(parsedLocation);
        setIsFirstVisit(false);
      } catch (error) {
        console.error('Error parsing saved location:', error);
        setUserLocation(null);
        localStorage.removeItem('userLocation');
        setIsFirstVisit(true);
      }
    } else {
      setUserLocation(null);
      setIsFirstVisit(true);
    }
    
    setIsLoading(false);
  }, []);

  const updateUserLocation = (location: UserLocation) => {
    setUserLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
    setIsFirstVisit(false);
  };

  const resetUserLocation = () => {
    localStorage.removeItem('userLocation');
    setUserLocation(null);
    setIsFirstVisit(true);
  };

  return {
    userLocation,
    isFirstVisit,
    isLoading,
    updateUserLocation,
    resetUserLocation
  };
};
