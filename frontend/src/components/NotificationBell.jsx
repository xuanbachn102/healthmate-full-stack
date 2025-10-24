import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationBell = () => {
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const loadNotifications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/notification/list`, {
        headers: { token }
      });

      if (data.success) {
        setNotifications(data.notifications.slice(0, 5)); // Show only latest 5
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `${backendUrl}/api/notification/mark-read`,
        { notificationId },
        { headers: { token } }
      );
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${backendUrl}/api/notification/mark-all-read`,
        {},
        { headers: { token } }
      );
      loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_confirmed':
        return '✅';
      case 'appointment_cancelled':
        return '❌';
      case 'appointment_reminder':
        return '⏰';
      case 'payment_success':
        return '💰';
      default:
        return '🔔';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!token) return null;

  return (
    <div className='relative'>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className='relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'
      >
        <svg
          className='w-6 h-6 text-gray-700 dark:text-gray-300'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
          />
        </svg>
        {/* Badge */}
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown Content */}
          <div className='absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20'>
            {/* Header */}
            <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className='text-sm text-primary hover:underline'
                >
                  {loading ? 'Marking...' : 'Mark all as read'}
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className='max-h-96 overflow-y-auto'>
              {notifications.length === 0 ? (
                <div className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification._id);
                      }
                      if (notification.appointmentId) {
                        navigate('/my-appointments');
                        setShowDropdown(false);
                      }
                    }}
                    className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                  >
                    <div className='flex items-start gap-3'>
                      <span className='text-2xl flex-shrink-0'>
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-gray-900 dark:text-white text-sm'>
                          {notification.title}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2'>
                          {notification.message}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className='w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2' />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className='px-4 py-3 border-t border-gray-200 dark:border-gray-700'>
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setShowDropdown(false);
                  }}
                  className='text-sm text-primary hover:underline w-full text-center'
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
