/**
 * ChalixHeaderWithUserPopup Component
 * 
 * Enhanced Chalix header component that integrates the user popup menu.
 * This component wraps the base header and adds user popup functionality.
 * 
 * Usage:
 * <ChalixHeaderWithUserPopup 
 *   platformName="LMS"
 *   searchPlaceholder="Search courses..."
 * />
 */

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import UserPopup from './UserPopup/UserPopup';
import useUserPopup from '../hooks/useUserPopup';
import './ChalixHeaderWithUserPopup.scss';

/**
 * User avatar button component
 */
const UserAvatarButton = ({ userData, onClick, isLoading }) => {
  return (
    <button
      type="button"
      className="user-avatar-button"
      onClick={onClick}
      title={userData?.full_name || 'User menu'}
      aria-label="User menu"
    >
      {isLoading ? (
        <div className="user-avatar-button__spinner" />
      ) : userData?.profile_image_url ? (
        <img
          src={userData.profile_image_url}
          alt={userData.full_name || 'User avatar'}
          className="user-avatar-button__image"
        />
      ) : (
        <FontAwesomeIcon icon={faUser} className="user-avatar-button__icon" />
      )}
    </button>
  );
};

UserAvatarButton.propTypes = {
  userData: PropTypes.shape({
    full_name: PropTypes.string,
    profile_image_url: PropTypes.string,
  }),
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

UserAvatarButton.defaultProps = {
  userData: null,
  isLoading: false,
};

/**
 * Enhanced header component with user popup
 */
const ChalixHeaderWithUserPopup = ({
  platformName,
  searchPlaceholder,
  baseApiUrl,
  logoutUrl,
  onUserMenuItemClick,
  onUserLogout,
}) => {
  const userPopup = useUserPopup({
    baseApiUrl,
    logoutUrl,
  });
  const popupContainerRef = useRef(null);

  const handleMenuItemClick = (item) => {
    if (onUserMenuItemClick) {
      onUserMenuItemClick(item);
    }
    userPopup.handleMenuItemClick(item);
  };

  const handleLogout = () => {
    if (onUserLogout) {
      onUserLogout();
    }
    userPopup.handleLogout();
  };

  return (
    <header className="chalix-header-with-popup">
      {/* Logo and platform name */}
      <div className="chalix-header-with-popup__brand">
        <h1 className="chalix-header-with-popup__title">
          {platformName}
        </h1>
      </div>

      {/* Search bar placeholder */}
      <div className="chalix-header-with-popup__search">
        <input
          type="text"
          className="chalix-header-with-popup__search-input"
          placeholder={searchPlaceholder}
          aria-label="Search"
        />
      </div>

      {/* User menu section */}
      <div 
        className="chalix-header-with-popup__user-section"
        ref={popupContainerRef}
      >
        <UserAvatarButton
          userData={userPopup.userData}
          onClick={userPopup.togglePopup}
          isLoading={userPopup.isLoading}
        />
        
        <UserPopup
          isOpen={userPopup.isOpen}
          onClose={userPopup.closePopup}
          onMenuItemClick={handleMenuItemClick}
          username={userPopup.userData?.username}
          fullName={userPopup.userData?.full_name}
          profileImageUrl={userPopup.userData?.profile_image_url}
          isLoading={userPopup.isLoading}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

ChalixHeaderWithUserPopup.propTypes = {
  /** Name of the platform (e.g., "LMS", "CMS") */
  platformName: PropTypes.string,
  /** Placeholder text for search input */
  searchPlaceholder: PropTypes.string,
  /** Base API URL for user data (default: '/api/user/v1') */
  baseApiUrl: PropTypes.string,
  /** URL to redirect to on logout (default: '/logout') */
  logoutUrl: PropTypes.string,
  /** Callback when user menu item is clicked */
  onUserMenuItemClick: PropTypes.func,
  /** Callback when user logs out */
  onUserLogout: PropTypes.func,
};

ChalixHeaderWithUserPopup.defaultProps = {
  platformName: 'Chalix',
  searchPlaceholder: 'Search...',
  baseApiUrl: '/api/user/v1',
  logoutUrl: '/logout',
  onUserMenuItemClick: null,
  onUserLogout: null,
};

export default ChalixHeaderWithUserPopup;
