/**
 * ChalixHeaderWithUserPopup Component
 * 
 * Vietnamese LMS header component matching Figma design.
 * Features:
 * - Top blue section with organization title and user menu
 * - Bottom navigation with tabs (Home, Category, Learning, Personalize) and search
 * 
 * Usage:
 * <ChalixHeaderWithUserPopup 
 *   organizationName=
 *   searchPlaceholder="Nhập từ khóa tìm kiếm"
 * />
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faBell, 
  faHome, 
  faList, 
  faGraduationCap, 
  faUserCircle,
  faSearch 
} from '@fortawesome/free-solid-svg-icons';
import UserPopup from './UserPopup/UserPopup';
import NotificationPopup from './NotificationPopup/NotificationPopup';
import useUserPopup from '../hooks/useUserPopup';
import useNotifications from '../hooks/useNotifications';
import './ChalixHeaderWithUserPopup.scss';

/**
 * User avatar button component
 */
const UserAvatarButton = ({ userData = null, onClick, isLoading = false }) => {
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

/**
 * Enhanced header component with Vietnamese design
 */
const ChalixHeaderWithUserPopup = ({
  organizationTitle = 'PHẦN MỀM HỌC TẬP THÔNG MINH DÀNH CHO CÔNG CHỨC, VIÊN CHỨC',
  organizationName = null, // Will be loaded from user profile
  searchPlaceholder = 'Nhập từ khóa tìm kiếm',
  baseApiUrl = '/api/user/v1',
  logoutUrl = '/logout',
  onUserMenuItemClick = null,
  onUserLogout = null,
  onNavigate = null,
  hideUserMenu = false,
}) => {
  const userPopup = useUserPopup({
    baseApiUrl,
    logoutUrl,
  });

  const notifications = useNotifications({
    autoFetch: true,
    pollInterval: 60000, // Poll every 60 seconds
  });

  // Get organization name from user data
  const getOrganizationName = () => {
    if (organizationName) return organizationName;
    
    // Use organization from user profile if available
    return userPopup.userData?.organization || '';
  };

  const handleMenuItemClick = (item) => {
    // If the menu item is "personalize", trigger the navigation handler
    if (item.id === 'personalize' && onNavigate) {
      onNavigate('personalize');
    } else if (onUserMenuItemClick) {
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

  const handleNavClick = (tab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      // Default navigation behavior if no handler provided
      const config = getConfig();
      const lmsBaseUrl = config.LMS_BASE_URL;
      // LEARNER_DASHBOARD_URL is already a full URL
      const learnerDashboardUrl = config.LEARNER_DASHBOARD_URL || `${lmsBaseUrl}/dashboard`;
      
      switch (tab) {
        case 'home':
          // Trang chủ - go to LMS home
          window.location.href = lmsBaseUrl;
          break;
        case 'category':
          // Danh mục - go to learner dashboard MFE
          window.location.href = learnerDashboardUrl;
          break;
        case 'learning':
          // Học tập - go to LMS home
          window.location.href = lmsBaseUrl;
          break;
        case 'personalize':
          // Cá nhân hóa - learner dashboard with personalized tab
          window.location.href = `${learnerDashboardUrl}?tab=personalized`;
          break;
        default:
          break;
      }
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    notifications.markNotificationsRead(notification.id);
    
    // Navigate to content URL if available
    if (notification.content_url) {
      window.location.href = notification.content_url;
    }
  };

  const handleViewAllNotifications = () => {
    // Navigate to notifications page
    window.location.href = '/notifications';
  };

  return (
    <header className="chalix-header-vietnamese">
      {/* Top Blue Header */}
      <div className="chalix-header-vietnamese__top">
        <div className="chalix-header-vietnamese__top-content">
          <div className="organization-info">
            <h1 className="organization-info__title">{organizationTitle}</h1>
            {getOrganizationName() && (
              <h2 className="organization-info__subtitle">{getOrganizationName()}</h2>
            )}
          </div>
          
          <div className="header-actions">
            {!hideUserMenu && (
              <>
                <div className="header-actions__notification-container">
                  <button 
                    className="header-actions__notification"
                    aria-label="Thông báo"
                    title="Thông báo"
                    onClick={notifications.togglePopup}
                  >
                    <FontAwesomeIcon icon={faBell} />
                    {notifications.hasNotifications && (
                      <span className="header-actions__notification-badge">
                        {notifications.notificationCount > 99 ? '99+' : notifications.notificationCount}
                      </span>
                    )}
                  </button>
                  
                  <NotificationPopup
                    isOpen={notifications.isOpen}
                    onClose={notifications.closePopup}
                    notifications={notifications.notifications}
                    isLoading={notifications.isLoading}
                    onNotificationClick={handleNotificationClick}
                    onViewAll={handleViewAllNotifications}
                  />
                </div>
                
                <div className="header-actions__user">
                  <button
                    type="button"
                    className="user-dropdown-button"
                    onClick={userPopup.togglePopup}
                    aria-label="User menu"
                  >
                    <span className="user-dropdown-button__name">
                      {userPopup.userData?.username?.toUpperCase() || 'USER'}
                    </span>
                    <UserAvatarButton
                      userData={userPopup.userData}
                      onClick={(e) => {
                        e.stopPropagation();
                        userPopup.togglePopup();
                      }}
                      isLoading={userPopup.isLoading}
                    />
                  </button>
                  
                  <UserPopup
                    isOpen={userPopup.isOpen}
                    onClose={userPopup.closePopup}
                    onMenuItemClick={handleMenuItemClick}
                    username={userPopup.userData?.username}
                    fullName={userPopup.userData?.full_name}
                    profileImageUrl={userPopup.userData?.profile_image_url}
                    accountType={userPopup.userData?.account_type}
                    role={userPopup.userData?.role}
                    isLoading={userPopup.isLoading}
                    onLogout={handleLogout}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="chalix-header-vietnamese__bottom">
        <div className="chalix-header-vietnamese__bottom-content">
          <nav className="main-navigation" aria-label="Main navigation">
            <button 
              className="nav-item"
              onClick={() => handleNavClick('home')}
              aria-label="Trang chủ"
            >
              <FontAwesomeIcon icon={faHome} className="nav-item__icon" />
              <span className="nav-item__label">Trang chủ</span>
            </button>
            
            <button 
              className="nav-item"
              onClick={() => handleNavClick('category')}
              aria-label="Danh mục"
            >
              <FontAwesomeIcon icon={faList} className="nav-item__icon" />
              <span className="nav-item__label">Danh mục</span>
            </button>
            
            <button 
              className="nav-item"
              onClick={() => handleNavClick('learning')}
              aria-label="Học tập"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="nav-item__icon" />
              <span className="nav-item__label">Học tập</span>
            </button>
            
            <button 
              className="nav-item"
              onClick={() => handleNavClick('personalize')}
              aria-label="Cá nhân hóa"
            >
              <FontAwesomeIcon icon={faUserCircle} className="nav-item__icon" />
              <span className="nav-item__label">Cá nhân hóa</span>
            </button>
          </nav>

          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                className="search-bar__input"
                placeholder={searchPlaceholder}
                aria-label="Tìm kiếm"
              />
              <button className="search-bar__button" aria-label="Tìm kiếm">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

ChalixHeaderWithUserPopup.propTypes = {
  /** Organization title (top line) */
  organizationTitle: PropTypes.string,
  /** Organization name - if not provided, will use user's organization from profile */
  organizationName: PropTypes.string,
  /** Placeholder text for search input */
  searchPlaceholder: PropTypes.string,
  /** Base API URL for user data */
  baseApiUrl: PropTypes.string,
  /** URL to redirect to on logout */
  logoutUrl: PropTypes.string,
  /** Callback when user menu item is clicked */
  onUserMenuItemClick: PropTypes.func,
  /** Callback when user logs out */
  onUserLogout: PropTypes.func,
  /** Callback when navigation item is clicked */
  onNavigate: PropTypes.func,
  /** Hide user menu (for pages like login/register) */
  hideUserMenu: PropTypes.bool,
};

export default ChalixHeaderWithUserPopup;
