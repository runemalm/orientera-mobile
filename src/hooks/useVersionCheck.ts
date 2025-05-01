
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
      
      // Extract build hash from the HTML
      // Looking for something like src="/assets/index-[hash].js"
      const match = html.match(/src="\/assets\/index-([a-zA-Z0-9]+)\.js"/);
      
      if (match && match[1]) {
        const currentHash = match[1];
        const storedHash = localStorage.getItem('app-version-hash');
        
        console.log('Version check - current hash:', currentHash, 'stored hash:', storedHash);
        
        if (storedHash && storedHash !== currentHash) {
          console.log('New version detected:', currentHash);
          setNewVersionAvailable(true);
        } else if (!storedHash) {
          // First time checking, store the hash
          console.log('First time check, storing hash:', currentHash);
          localStorage.setItem('app-version-hash', currentHash);
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
    // Store the new hash before reloading
    const storedHash = localStorage.getItem('app-version-hash-new');
    if (storedHash) {
      localStorage.setItem('app-version-hash', storedHash);
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
