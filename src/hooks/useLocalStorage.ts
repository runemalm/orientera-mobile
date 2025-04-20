
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Using a function in useState ensures the localStorage lookup only happens once on initial render
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Check if item exists and is not undefined or null before parsing
      if (item) {
        const parsedItem = JSON.parse(item);
        
        // If this is a filter object with dates, convert date strings back to Date objects
        if (parsedItem && 
            typeof parsedItem === 'object' && 
            parsedItem.dateRange && 
            typeof parsedItem.dateRange === 'object') {
          
          // Convert dateRange.from string to Date if it exists
          if (parsedItem.dateRange.from) {
            parsedItem.dateRange.from = new Date(parsedItem.dateRange.from);
          }
          
          // Convert dateRange.to string to Date if it exists
          if (parsedItem.dateRange.to) {
            parsedItem.dateRange.to = new Date(parsedItem.dateRange.to);
          }
        }
        
        // Make sure we return initialValue if parsedItem is null or undefined
        return parsedItem !== null && parsedItem !== undefined ? parsedItem : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  // Update localStorage whenever storedValue changes
  useEffect(() => {
    try {
      if (storedValue !== undefined && storedValue !== null) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } else {
        // If value is undefined or null, remove the item from localStorage
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
