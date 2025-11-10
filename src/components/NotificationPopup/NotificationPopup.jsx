/**
 * NotificationPopup Component
 * 
 * Vietnamese-style notification dropdown that displays user notifications.
 * Shows notification list with course enrollment messages matching the screenshot design.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './NotificationPopup.scss';

/**
 * Format relative time in Vietnamese
 */
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return '1 ngày trước';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  // Format as date for older notifications
  return date.toLocaleDateString('vi-VN');
};

/**
 * Single notification item
 */
const NotificationItem = ({ notification, onClick }) => {
  const isUnread = !notification.last_read;
  
  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <div 
      className={`notification-item ${isUnread ? 'notification-item--unread' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="notification-item__indicator">
        {isUnread && (
          <FontAwesomeIcon 
            icon={faCircle} 
            className="notification-item__unread-dot"
          />
        )}
      </div>
      
      <div className="notification-item__content">
        <div 
          className="notification-item__message"
          dangerouslySetInnerHTML={{ __html: notification.content }}
        />
        <div className="notification-item__time">
          {formatTimeAgo(notification.created)}
        </div>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    last_read: PropTypes.string,
    content_url: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

/**
 * Main notification popup component
 */
const NotificationPopup = ({
  isOpen,
  onClose,
  notifications,
  isLoading,
  onNotificationClick,
  onViewAll,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.notification-popup') && !e.target.closest('.header-actions__notification')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="notification-popup">
      <div className="notification-popup__header">
        <h3 className="notification-popup__title">THÔNG BÁO</h3>
      </div>

      <div className="notification-popup__body">
        {isLoading ? (
          <div className="notification-popup__loading">
            <FontAwesomeIcon icon={faSpinner} spin className="notification-popup__spinner" />
            <span>Đang tải...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-popup__empty">
            <p>Không có thông báo mới</p>
          </div>
        ) : (
          <div className="notification-popup__list">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onNotificationClick}
              />
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-popup__footer">
          <button
            type="button"
            className="notification-popup__view-all"
            onClick={onViewAll}
          >
            Xem tất cả thông báo
          </button>
        </div>
      )}
    </div>
  );
};

NotificationPopup.propTypes = {
  /** Whether the popup is open */
  isOpen: PropTypes.bool.isRequired,
  /** Callback when popup should close */
  onClose: PropTypes.func.isRequired,
  /** Array of notification objects */
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      created: PropTypes.string.isRequired,
      last_read: PropTypes.string,
      content_url: PropTypes.string,
    })
  ),
  /** Whether notifications are loading */
  isLoading: PropTypes.bool,
  /** Callback when a notification is clicked */
  onNotificationClick: PropTypes.func,
  /** Callback when "View All" button is clicked */
  onViewAll: PropTypes.func,
};

NotificationPopup.defaultProps = {
  notifications: [],
  isLoading: false,
  onNotificationClick: null,
  onViewAll: null,
};

export default NotificationPopup;
