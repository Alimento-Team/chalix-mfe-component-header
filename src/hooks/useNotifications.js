/**
 * useNotifications Hook
 * 
 * Custom hook for managing notifications state and API interactions.
 * Handles fetching notification count, list, and marking notifications as seen/read.
 */

import { useState, useCallback, useEffect } from 'react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

/**
 * Hook to manage notifications functionality
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Whether to automatically fetch on mount (default: true)
 * @param {number} options.pollInterval - Polling interval in ms (0 = no polling)
 * @returns {Object} Notifications state and handlers
 */
const useNotifications = (options = {}) => {
  const {
    autoFetch = true,
    pollInterval = 0,
  } = options;

  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [countByApp, setCountByApp] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNotificationsTray, setShowNotificationsTray] = useState(true);

  // Fetch notification count
  const fetchNotificationCount = useCallback(async () => {
    try {
      const client = getAuthenticatedHttpClient();
      const config = getConfig();
      const baseUrl = config.LMS_BASE_URL || '';
      
      const response = await client.get(`${baseUrl}/api/notifications/count/`);
      
      if (response.status === 200 && response.data) {
        setNotificationCount(response.data.count || 0);
        setCountByApp(response.data.count_by_app_name || {});
        setShowNotificationsTray(response.data.show_notifications_tray !== false);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error fetching notification count:', err);
      // Don't set error state for count fetch failures - fail silently
      return null;
    }
  }, []);

  // Fetch notification list
  const fetchNotifications = useCallback(async (appName = null) => {
    try {
      setIsLoading(true);
      setError(null);

      const client = getAuthenticatedHttpClient();
      const config = getConfig();
      const baseUrl = config.LMS_BASE_URL || '';
      
      const params = new URLSearchParams();
      if (appName) {
        params.append('app_name', appName);
      }
      // Mark tray as opened
      params.append('tray_opened', 'true');
      
      const url = `${baseUrl}/api/notifications/?${params.toString()}`;
      const response = await client.get(url);
      
      if (response.status === 200 && response.data) {
        setNotifications(response.data.results || []);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to load notifications');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark notifications as seen for a specific app
  const markNotificationsSeen = useCallback(async (appName) => {
    try {
      const client = getAuthenticatedHttpClient();
      const config = getConfig();
      const baseUrl = config.LMS_BASE_URL || '';
      
      await client.put(`${baseUrl}/api/notifications/mark-seen/${appName}/`);
      
      // Refresh count after marking as seen
      await fetchNotificationCount();
      
      return true;
    } catch (err) {
      console.error('Error marking notifications as seen:', err);
      return false;
    }
  }, [fetchNotificationCount]);

  // Mark specific notifications as read
  const markNotificationsRead = useCallback(async (notificationIds) => {
    try {
      const client = getAuthenticatedHttpClient();
      const config = getConfig();
      const baseUrl = config.LMS_BASE_URL || '';
      
      await client.patch(`${baseUrl}/api/notifications/read/`, {
        notification_ids: Array.isArray(notificationIds) ? notificationIds : [notificationIds],
      });
      
      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notificationIds.includes(notification.id)
            ? { ...notification, last_read: new Date().toISOString() }
            : notification
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      return false;
    }
  }, []);

  // Toggle popup open/closed
  const togglePopup = useCallback(async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Fetch notifications when opening
    if (newIsOpen && notifications.length === 0) {
      await fetchNotifications();
    }
  }, [isOpen, notifications.length, fetchNotifications]);

  // Close popup
  const closePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Open popup
  const openPopup = useCallback(async () => {
    setIsOpen(true);
    
    // Fetch notifications when opening
    if (notifications.length === 0) {
      await fetchNotifications();
    }
  }, [notifications.length, fetchNotifications]);

  // Refresh all notification data
  const refreshNotifications = useCallback(async () => {
    await Promise.all([
      fetchNotificationCount(),
      isOpen ? fetchNotifications() : Promise.resolve(),
    ]);
  }, [fetchNotificationCount, fetchNotifications, isOpen]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchNotificationCount();
    }
  }, [autoFetch, fetchNotificationCount]);

  // Set up polling if requested
  useEffect(() => {
    if (pollInterval > 0) {
      const intervalId = setInterval(() => {
        fetchNotificationCount();
      }, pollInterval);

      return () => clearInterval(intervalId);
    }
  }, [pollInterval, fetchNotificationCount]);

  return {
    // State
    isOpen,
    notifications,
    notificationCount,
    countByApp,
    isLoading,
    error,
    showNotificationsTray,

    // Actions
    togglePopup,
    closePopup,
    openPopup,
    fetchNotifications,
    fetchNotificationCount,
    markNotificationsSeen,
    markNotificationsRead,
    refreshNotifications,

    // Computed
    hasNotifications: notificationCount > 0,
    unreadNotifications: notifications.filter(n => !n.last_read),
  };
};

export default useNotifications;
