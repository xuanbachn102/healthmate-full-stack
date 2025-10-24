import notificationModel from '../models/notificationModel.js';

/**
 * Get all notifications for a user
 * @route GET /api/notification/list
 */
export const getNotifications = async (req, res) => {
    try {
        const { userId } = req.body;

        const notifications = await notificationModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await notificationModel.countDocuments({ userId, isRead: false });

        res.json({
            success: true,
            notifications,
            unreadCount
        });

    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get notifications'
        });
    }
};

/**
 * Mark notification as read
 * @route POST /api/notification/mark-read
 */
export const markAsRead = async (req, res) => {
    try {
        const { notificationId, userId } = req.body;

        await notificationModel.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true }
        );

        res.json({
            success: true,
            message: 'Notification marked as read'
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read'
        });
    }
};

/**
 * Mark all notifications as read
 * @route POST /api/notification/mark-all-read
 */
export const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.body;

        await notificationModel.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });

    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark all notifications as read'
        });
    }
};

/**
 * Delete notification
 * @route POST /api/notification/delete
 */
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId, userId } = req.body;

        await notificationModel.findOneAndDelete({ _id: notificationId, userId });

        res.json({
            success: true,
            message: 'Notification deleted'
        });

    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification'
        });
    }
};

/**
 * Create notification (internal use)
 */
export const createNotification = async (userId, type, title, message, appointmentId = null, data = {}) => {
    try {
        const notification = new notificationModel({
            userId,
            type,
            title,
            message,
            appointmentId,
            data
        });

        await notification.save();
        return notification;

    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};
