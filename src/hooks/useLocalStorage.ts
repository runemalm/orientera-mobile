import { useState, useEffect, useRef } from 'react';

// Updated type to support functional updates
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

  // Update localStorage whenever storedValue changes
  useEffect(() => {
    try {
      if (storedValue !== undefined && storedValue !== null) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
        latestValueRef.current = storedValue;
      } else {
        // If value is undefined or null, remove the item from localStorage
        window.localStorage.removeItem(key);
        latestValueRef.current = null;
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  // Modified setValue function to handle both direct values and functional updates
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function 
        ? value(latestValueRef.current !== null ? latestValueRef.current : storedValue) 
        : value;
      
      // Immediately update the ref to the latest value to prevent race conditions
      latestValueRef.current = valueToStore;
      
      // Save state
      setStoredValue(valueToStore);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue];
}
