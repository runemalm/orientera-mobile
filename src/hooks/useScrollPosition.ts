
import { useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useScrollPosition = (key: string) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [savedPosition, setSavedPosition] = useLocalStorage<number>(`scroll-${key}`, 0);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Restore scroll position
      container.scrollTop = savedPosition;
      
      // Save scroll position on scroll
      const handleScroll = () => {
        setSavedPosition(container.scrollTop);
      };
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [savedPosition, setSavedPosition]);

  return scrollContainerRef;
};
