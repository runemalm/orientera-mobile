
import { useState, useEffect } from 'react';
import { UserSession, UserDTO } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { API_BASE_URL } from '../services/api';

export function useAuth() {
  const [userSession, setUserSession] = useLocalStorage<UserSession | null>('user_session', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is logged in
  const isLoggedIn = !!userSession?.token;

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success && data.userId && data.token) {
        // Save the basic session info
        const session: UserSession = {
          userId: data.userId,
          token: data.token,
        };
        setUserSession(session);
        
        // Fetch the full user profile
        await fetchUserProfile(data.userId, data.token);
        return true;
      } else {
        setError(data.error || 'Failed to login');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the user profile with the user ID
  const fetchUserProfile = async (userId: string, token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/get-user?id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData: UserDTO = await response.json();
      
      // Update the session with the profile info
      setUserSession(prev => {
        if (prev) {
          return {
            ...prev,
            firstName: userData.firstName,
            lastName: userData.lastName,
          };
        }
        return prev;
      });
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  // Logout function
  const logout = () => {
    setUserSession(null);
  };

  // Refresh user profile
  const refreshProfile = async (): Promise<void> => {
    if (userSession?.userId && userSession?.token) {
      await fetchUserProfile(userSession.userId, userSession.token);
    }
  };

  // Effect to check session on mount
  useEffect(() => {
    if (userSession?.userId && userSession?.token && (!userSession.firstName || !userSession.lastName)) {
      fetchUserProfile(userSession.userId, userSession.token);
    }
  }, []);

  return {
    userSession,
    isLoggedIn,
    isLoading,
    error,
    login,
    logout,
    refreshProfile
  };
}
