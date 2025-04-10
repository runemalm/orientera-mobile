
import { useState, useEffect } from 'react';

interface UserLocation {
  city: string;
  latitude: number;
  longitude: number;
}

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
        setIsFirstVisit(true);
      }
    } else {
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
