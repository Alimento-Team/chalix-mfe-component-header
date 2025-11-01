/**
 * Main entry point for @chalix/frontend-component-header
 * Exports all public components
 */

export { default as ChalixHeaderWithUserPopup } from './components/ChalixHeaderWithUserPopup';
export { default as UserPopup } from './components/UserPopup/UserPopup';
export { default as useUserPopup } from './hooks/useUserPopup';

// Re-export from dist for backward compatibility
export { ChalixHeader, LearningHeader, StudioHeader, messages } from '../dist/index';
