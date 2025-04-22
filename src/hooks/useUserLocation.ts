
import { useState, useEffect } from 'react';

export interface UserLocation {
  city: string;
  latitude: number;
  longitude: number;
}

const DEFAULT_LOCATION = {
  city: 'Kalmar',
  latitude: 56.6784,
  longitude: 16.3620
};

export const useUserLocation = () => {
  // By default, userLocation is null if never set
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locationWasEverSet, setLocationWasEverSet] = useState<boolean>(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setUserLocation(parsedLocation);
        setLocationWasEverSet(true);
        setIsFirstVisit(false);
      } catch (error) {
        console.error('Error parsing saved location:', error);
        setUserLocation(null);
        localStorage.removeItem('userLocation');
        setLocationWasEverSet(false);
        setIsFirstVisit(true);
      }
    } else {
      setUserLocation(null); // REMAIN null unless set
      setLocationWasEverSet(false);
      setIsFirstVisit(true);
    }
    setIsLoading(false);
  }, []);

  const updateUserLocation = (location: UserLocation) => {
    setUserLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
    setLocationWasEverSet(true);
    setIsFirstVisit(false);
  };

  const resetUserLocation = () => {
    localStorage.removeItem('userLocation');
    setUserLocation(null);
    setLocationWasEverSet(false);
    setIsFirstVisit(true);
  };

  // Optionally expose a fallback location for components that really want a default
  const fallbackLocation = DEFAULT_LOCATION;

  return {
    userLocation,
    isFirstVisit,
    isLoading,
    locationWasEverSet,
    updateUserLocation,
    resetUserLocation,
    fallbackLocation,
  };
};
