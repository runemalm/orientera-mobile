
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

// Time between version checks (3 minutes)
const CHECK_INTERVAL = 3 * 60 * 1000;

export function useVersionCheck() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [lastChecked, setLastChecked] = useLocalStorage<number>('last-version-check', 0);
  const checkingRef = useRef(false);
  
  // Function to check for new version
  const checkForNewVersion = async () => {
    // Prevent concurrent checks
    if (checkingRef.current) return;
    
    checkingRef.current = true;
    
    try {
      // Fetch the index.html to check for changes
      const response = await fetch('/index.html', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) return;
      
      const html = await response.text();
      
      // Extract build hash from meta tag
      const match = html.match(/<meta name="app-version" content="([^"]+)"/i);
      
      if (match && match[1]) {
        const currentBuildHash = match[1];
        const storedBuildHash = localStorage.getItem('app-version-hash');
        
        console.log('Version check - current version:', currentBuildHash, 'stored version:', storedBuildHash);
        
        if (storedBuildHash && storedBuildHash !== currentBuildHash) {
          console.log('New version detected:', currentBuildHash);
          // Instead of just setting state, automatically update
          updateApp(currentBuildHash);
        } else if (!storedBuildHash) {
          // First time checking, store the hash
          console.log('First time check, storing version:', currentBuildHash);
          localStorage.setItem('app-version-hash', currentBuildHash);
        }
      }
    } catch (error) {
      console.error('Error checking for app updates:', error);
    } finally {
      checkingRef.current = false;
      // Update last checked time
      setLastChecked(Date.now());
    }
  };
  
  // Function to update the app
  const updateApp = (currentBuildHash?: string) => {
    // Show a brief toast notification
    toast.info("Uppdaterar till den senaste versionen...");
    
    // Update stored hash before reload to prevent immediate update notification on reload
    if (currentBuildHash) {
      localStorage.setItem('app-version-hash', currentBuildHash);
    } else {
      // If currentBuildHash not provided, try to get it from the DOM
      const html = document.documentElement.innerHTML;
      const match = html.match(/<meta name="app-version" content="([^"]+)"/i);
      if (match && match[1]) {
        localStorage.setItem('app-version-hash', match[1]);
      }
    }
    
    // Short timeout to allow toast to be visible before reload
    setTimeout(() => {
      // Reload the page to get the latest version
      window.location.reload();
    }, 1500);
  };
  
  useEffect(() => {
    // Check on mount if enough time has passed since last check
    const initialCheck = async () => {
      const now = Date.now();
      if (now - lastChecked > CHECK_INTERVAL) {
        await checkForNewVersion();
      }
    };
    
    initialCheck();
    
    // Set up periodic checking
    const interval = setInterval(checkForNewVersion, CHECK_INTERVAL);
    
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return { newVersionAvailable, updateApp };
}
