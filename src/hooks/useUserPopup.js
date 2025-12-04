/**
 * useUserPopup Hook
 * 
 * Custom hook for managing user popup state and API interactions.
 * Handles fetching user data, managing open/close state, and logout functionality.
 * 
 * Updated to support CMS/LMS authentication patterns with fallback logic.
 */

import { useState, useCallback, useEffect } from 'react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

/**
 * Hook to manage user popup functionality
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.baseApiUrl - Base URL for API calls (default: '/api/user/v1')
 * @param {string} options.logoutUrl - URL to redirect to on logout (default: '/logout')
 * @returns {Object} User popup state and handlers
 */
const useUserPopup = (options = {}) => {
  const {
    baseApiUrl = '/api/user/v1',
    logoutUrl = '/logout',
  } = options;

  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data from API with fallback logic
  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const client = getAuthenticatedHttpClient();
      const config = getConfig();
      
      // Determine the base URL for API calls
      const apiBase = config.LMS_BASE_URL || config.BASE_URL || '';
      
      // Try multiple endpoints for user data
      const endpoints = [
        `${apiBase}/api/user/v1/user_popup/`,                   // Primary endpoint
        `${apiBase}${baseApiUrl}/user_popup/`,                  // Alternative endpoint
        `${apiBase}/api/user/v1/accounts/${config.USERNAME}/`,  // Fallback to specific user account
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          response = await client.get(endpoint);
          if (response.status === 200 && response.data) {
            break; // Success, exit loop
          }
        } catch (err) {
          lastError = err;
          console.warn(`Failed to fetch from ${endpoint}:`, err.message);
          continue; // Try next endpoint
        }
      }

      if (response && response.data) {
        // Normalize the data structure
        // Extract profile image URL from various possible formats
        let profileImageUrl = '';
        if (response.data.profile_image_url) {
          profileImageUrl = response.data.profile_image_url;
        } else if (response.data.profile_image) {
          // profile_image might be an object with image_url_* keys or a direct URL string
          if (typeof response.data.profile_image === 'string') {
            profileImageUrl = response.data.profile_image;
          } else if (response.data.profile_image && response.data.profile_image.image_url_full) {
            profileImageUrl = response.data.profile_image.image_url_full;
          } else if (response.data.profile_image && response.data.profile_image.image_url_medium) {
            profileImageUrl = response.data.profile_image.image_url_medium;
          }
        } else if (response.data.image_url_full) {
          profileImageUrl = response.data.image_url_full;
        } else if (response.data.image_url_medium) {
          profileImageUrl = response.data.image_url_medium;
        } else if (response.data.avatar) {
          profileImageUrl = response.data.avatar;
        }
        
        const normalizedData = {
          username: response.data.username || response.data.user || '',
          full_name: response.data.full_name || response.data.name || response.data.username || '',
          email: response.data.email || '',
          profile_image_url: profileImageUrl,
          is_staff: response.data.is_staff || false,
          is_superuser: response.data.is_superuser || false,
          organization: response.data.organization || '',
        };
        setUserData(normalizedData);
      } else {
        throw lastError || new Error('No user data available');
      }
    } catch (err) {
      console.error('Error fetching user popup data:', err);
      setError(err.message || 'Failed to load user data');
      
      // Set a minimal user object if we're authenticated but can't fetch details
      try {
        const config = getConfig();
        if (config && config.USER_ID) {
          setUserData({
            username: config.USERNAME || 'User',
            full_name: config.USERNAME || 'User',
            email: config.USER_EMAIL || '',
            profile_image_url: '',
            is_staff: false,
            is_superuser: false,
            organization: '',
          });
        }
      } catch (configErr) {
        console.warn('Could not load user from config:', configErr);
      }
    } finally {
      setIsLoading(false);
    }
  }, [baseApiUrl]);

  // Fetch user data immediately on mount (not when popup opens)
  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [userData, fetchUserData]);

  // Toggle popup open/closed
  const togglePopup = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  // Close popup
  const closePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle menu item click
  const handleMenuItemClick = useCallback((item) => {
    // Can be used for tracking or other actions
    console.log('Menu item clicked:', item.id);
  }, []);

  // Handle logout with CMS/LMS compatible flow
  const handleLogout = useCallback(async () => {
    try {
      const client = getAuthenticatedHttpClient();
      const config = getConfig();
      
      // Try to call logout endpoint
      const logoutEndpoints = [
        `${baseApiUrl}/accounts/deactivate_logout/`,
        `${config.LMS_BASE_URL}/logout`,
        logoutUrl,
      ];

      for (const endpoint of logoutEndpoints) {
        try {
          await client.post(endpoint);
          break; // Success, exit loop
        } catch (err) {
          console.warn(`Logout endpoint ${endpoint} not available:`, err.message);
          continue;
        }
      }

      // Redirect to configured logout URL or fallback
      const finalLogoutUrl = config.FRONTEND_LOGOUT_URL || 
                            config.LOGOUT_URL || 
                            logoutUrl || 
                            '/logout';
      window.location.href = finalLogoutUrl;
    } catch (err) {
      console.error('Error during logout:', err);
      // Still redirect on error
      window.location.href = logoutUrl || '/logout';
    }
  }, [baseApiUrl, logoutUrl]);

  // Refresh user data
  const refreshUserData = useCallback(() => {
    setUserData(null);
    fetchUserData();
  }, [fetchUserData]);

  return {
    // State
    isOpen,
    userData,
    isLoading,
    error,

    // Actions
    togglePopup,
    closePopup,
    openPopup: () => setIsOpen(true),
    handleMenuItemClick,
    handleLogout,
    refreshUserData,

    // Computed
    isAuthenticated: !!userData,
  };
};

export default useUserPopup;
