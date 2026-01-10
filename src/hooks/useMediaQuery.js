/**
 * Custom hook to detect media query changes
 * Helps with responsive design decisions
 */

import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is defined (SSR safety)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create listener
    const handleChange = (e) => {
      setMatches(e.matches);
    };

    // Add listener - use addEventListener for better compatibility
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

/**
 * Convenience hook for common breakpoints
 */
export const useResponsive = () => {
  const isMobilePortrait = useMediaQuery('(max-width: 480px)');
  const isMobileLandscape = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return {
    isMobilePortrait,  // <= 480px
    isMobileLandscape, // <= 768px
    isTablet,          // <= 1024px
    isDesktop,         // >= 1025px
  };
};

export default useMediaQuery;
