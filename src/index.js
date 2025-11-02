/**
 * Main entry point for @chalix/frontend-component-header
 * Exports all public components
 */

export { default as ChalixHeaderWithUserPopup } from './components/ChalixHeaderWithUserPopup';
export { default as UserPopup } from './components/UserPopup/UserPopup';
export { default as useUserPopup } from './hooks/useUserPopup';

// Export old components if they exist in dist (for backward compatibility)
// These are the legacy components
export { default as ChalixHeader } from '../dist/ChalixHeader';
export { default as LearningHeader } from '../dist/learning-header/LearningHeader';
export { default as StudioHeader } from '../dist/studio-header/index';
export { default as messages } from '../dist/i18n/index';
