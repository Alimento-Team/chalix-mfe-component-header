/**
 * UserPopup Component
 * 
 * Displays a dropdown menu with user information and options.
 * Features:
 * - User profile image
 * - User name and basic info
 * - Menu items: Courses, Update Info, Personalization, etc.
 * - Logout functionality
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faUser,
  faCog,
  faClipboardList,
  faChartBar,
  faCalendarAlt,
  faChalkboard,
  faQuestionCircle,
  faSignOutAlt,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import './UserPopup.scss';

/**
 * UserPopup component - displays user menu with profile and navigation options
 */
const UserPopup = ({
  isOpen,
  onClose,
  onMenuItemClick = null,
  username = null,
  fullName = null,
  profileImageUrl = null,
  accountType = null,
  role = null,
  isLoading = false,
  onLogout = null,
}) => {
  const popupRef = useRef(null);

  useEffect(() => {
    /**
     * Handle clicks outside the popup to close it
     */
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return undefined;
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Don't show loading spinner in the popup since data is pre-fetched
  // If still loading, show the popup with whatever data we have

  const menuItems = [
    {
      id: 'courses',
      label: 'Khóa học',
      icon: faBook,
      href: '/dashboard',
    },
    {
      id: 'update-info',
      label: 'Cập nhật thông tin',
      icon: faUser,
      href: '/account/profile',
    },
    {
      id: 'personalization',
      label: 'Cá nhân hóa',
      icon: faCog,
      href: '/account/preferences',
    },
    {
      id: 'requests',
      label: 'Danh sách yêu cầu',
      icon: faClipboardList,
      href: '/requests',
    },
    {
      id: 'learning-results',
      label: 'Kết quả học tập',
      icon: faChartBar,
      href: '/learning-results',
    },
    {
      id: 'personal-plan',
      label: 'Lập kế hoạch cá nhân',
      icon: faCalendarAlt,
      href: '/personal-plan',
    },
    {
      id: 'register-teaching',
      label: 'Đăng ký giảng dạy',
      icon: faChalkboard,
      href: '/register-teaching',
    },
    {
      id: 'help',
      label: 'Trợ giúp',
      icon: faQuestionCircle,
      href: '/help',
    },
  ];

  const handleMenuItemClick = (item) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
    onClose();
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  return (
    <div ref={popupRef} className="user-popup">
      {/* Header with user info */}
      <div className="user-popup__header">
        <div className="user-popup__avatar-wrapper">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={fullName || username}
              className="user-popup__avatar"
            />
          ) : (
            <div className="user-popup__avatar user-popup__avatar--placeholder">
              <FontAwesomeIcon icon={faUser} />
            </div>
          )}
        </div>
        <div className="user-popup__info">
          <div className="user-popup__name">{username?.toUpperCase() || 'USER'}</div>
          <div className="user-popup__details">
            {username && <span>{username}</span>}
            {accountType && (
              <>
                <span> - </span>
                <span>{accountType}</span>
              </>
            )}
            {role && (
              <>
                <span> - </span>
                <span>{role}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu items */}
      <nav className="user-popup__menu">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="user-popup__menu-item"
            onClick={(e) => {
              if (onMenuItemClick) {
                e.preventDefault();
                handleMenuItemClick(item);
              }
            }}
          >
            <FontAwesomeIcon icon={item.icon} className="user-popup__menu-icon" />
            <span className="user-popup__menu-label">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Logout button */}
      <div className="user-popup__footer">
        <button
          type="button"
          className="user-popup__logout-btn"
          onClick={handleLogoutClick}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="user-popup__logout-icon" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

UserPopup.propTypes = {
  /** Whether the popup is open/visible */
  isOpen: PropTypes.bool.isRequired,
  /** Callback when popup should close */
  onClose: PropTypes.func.isRequired,
  /** Callback when a menu item is clicked */
  onMenuItemClick: PropTypes.func,
  /** Username of the current user */
  username: PropTypes.string,
  /** Full name of the current user */
  fullName: PropTypes.string,
  /** URL to user's profile image */
  profileImageUrl: PropTypes.string,
  /** Account type (e.g., "Tài khoản Bộ") */
  accountType: PropTypes.string,
  /** User role (e.g., "None", "Admin") */
  role: PropTypes.string,
  /** Whether data is currently loading */
  isLoading: PropTypes.bool,
  /** Callback when logout is clicked */
  onLogout: PropTypes.func,
};

export default UserPopup;
