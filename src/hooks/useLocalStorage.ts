
import { useState, useEffect, useRef, useCallback } from 'react';

// A more robust useLocalStorage hook with synchronous and asynchronous update support
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Keep a ref to the latest value to prevent race conditions
  const latestValueRef = useRef<T | null>(null);
  
  // Using a function in useState ensures the localStorage lookup only happens once on initial render
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Check if item exists and is not undefined or null before parsing
      if (item) {
        const parsedItem = JSON.parse(item);
        // Make sure we return initialValue if parsedItem is null or undefined
        const value = parsedItem !== null && parsedItem !== undefined ? parsedItem : initialValue;
        latestValueRef.current = value; // Set the initial ref value
        return value;
      }
      latestValueRef.current = initialValue;
      return initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      latestValueRef.current = initialValue;
      return initialValue;
    }
  });

  // A memoized version of setValue to ensure it doesn't change on re-renders
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function 
        ? value(latestValueRef.current !== null ? latestValueRef.current : storedValue) 
        : value;
      
      // Immediately update the ref to the latest value to prevent race conditions
      latestValueRef.current = valueToStore;
      
      // Save state
      setStoredValue(valueToStore);

      // Update localStorage synchronously
      if (valueToStore !== undefined && valueToStore !== null) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }, [key, storedValue]);

  // Update localStorage when value changes
  // This is primarily here for cross-tab synchronization
  useEffect(() => {
    // Since we're already writing to localStorage in setValue,
    // we only need to handle external changes here
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = JSON.parse(event.newValue);
          // Only update the state if the value has actually changed
          if (JSON.stringify(newValue) !== JSON.stringify(latestValueRef.current)) {
            latestValueRef.current = newValue;
            setStoredValue(newValue);
          }
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
