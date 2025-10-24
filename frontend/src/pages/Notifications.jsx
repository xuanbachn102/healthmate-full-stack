import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';

const Notifications = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    if (token) {
      loadNotifications();
    }
  }, [token]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/notification/list`, {
        headers: { token }
      });

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
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
      await axios.post(
        `${backendUrl}/api/notification/mark-all-read`,
        {},
        { headers: { token } }
      );
      toast.success('All notifications marked as read');
      loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.post(
        `${backendUrl}/api/notification/delete`,
        { notificationId },
        { headers: { token } }
      );
      toast.success('Notification deleted');
      loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
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

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  if (!token) {
    return (
      <div className='text-center py-20'>
        <p className='text-gray-600 dark:text-gray-400'>Please login to view notifications</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Notifications
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all'
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className='flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700'>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'all'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'unread'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'read'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className='flex justify-center py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className='text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <p className='text-gray-600 dark:text-gray-400'>
            {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all ${
                !notification.isRead ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <div className='flex items-start gap-4'>
                {/* Icon */}
                <div className='text-3xl flex-shrink-0'>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-900 dark:text-white'>
                        {notification.title}
                      </h3>
                      <p className='text-gray-600 dark:text-gray-400 mt-1'>
                        {notification.message}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-500 mt-2'>
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className='w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2' />
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2 mt-3'>
                    {notification.appointmentId && (
                      <button
                        onClick={() => navigate('/my-appointments')}
                        className='text-sm text-primary hover:underline'
                      >
                        View Appointment
                      </button>
                    )}
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className='text-sm text-red-600 dark:text-red-400 hover:underline'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
