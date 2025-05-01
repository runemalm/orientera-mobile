
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

// Time between version checks (3 minutes)
const CHECK_INTERVAL = 3 * 60 * 1000;

export function useVersionCheck() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [lastChecked, setLastChecked] = useLocalStorage<number>('last-version-check', 0);
  
  // Function to check for new version
  const checkForNewVersion = async () => {
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
        
        if (storedHash && storedHash !== currentHash) {
          console.log('New version detected:', currentHash);
          setNewVersionAvailable(true);
        } else if (!storedHash) {
          // First time checking, store the hash
          localStorage.setItem('app-version-hash', currentHash);
        }
      }
      
      // Update last checked time
      setLastChecked(Date.now());
    } catch (error) {
      console.error('Error checking for app updates:', error);
    }
  };
  
  // Function to update the app
  const updateApp = () => {
    // Reload the page to get the latest version
    window.location.reload();
  };
  
  useEffect(() => {
    // Check on mount
    checkForNewVersion();
    
    // Set up periodic checking
    const now = Date.now();
    if (now - lastChecked > CHECK_INTERVAL) {
      checkForNewVersion();
    }
    
    const interval = setInterval(checkForNewVersion, CHECK_INTERVAL);
    
    return () => clearInterval(interval);
  }, [lastChecked]);
  
  return { newVersionAvailable, updateApp };
}
