
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
      
      // Extract version from the meta tag
      const match = html.match(/<meta name="app-version" content="([^"]+)"/);
      
      if (match && match[1]) {
        const currentVersion = match[1];
        const storedVersion = localStorage.getItem('app-version');
        
        console.log('Version check - current version:', currentVersion, 'stored version:', storedVersion);
        
        // Check if we have a valid version (not a template)
        if (currentVersion.includes('<%')) {
          console.log('Skipping version check - template detected');
          return;
        }
        
        if (storedVersion && storedVersion !== currentVersion) {
          console.log('New version detected:', currentVersion);
          // Store the new version for use after reload
          localStorage.setItem('app-version-new', currentVersion);
          setNewVersionAvailable(true);
          toast.info('A new version is available');
        } else if (!storedVersion) {
          // First time checking, store the version
          console.log('First time check, storing version:', currentVersion);
          localStorage.setItem('app-version', currentVersion);
        }
      }
    } catch (error) {
      console.error('Error checking for app updates:', error);
    } finally {
      // Update last checked time outside of the effect dependencies
      const now = Date.now();
      setLastChecked(now);
      checkingRef.current = false;
    }
  };
  
  // Function to update the app
  const updateApp = () => {
    // Store the new version before reloading
    const newVersion = localStorage.getItem('app-version-new');
    if (newVersion) {
      localStorage.setItem('app-version', newVersion);
    }
    
    // Reload the page to get the latest version
    window.location.reload();
  };
  
  // Single effect for initialization and interval setup
  useEffect(() => {
    // Initial check on mount only if enough time has passed
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
  }, []); // No dependencies to avoid re-running effect
  
  return { newVersionAvailable, updateApp };
}
