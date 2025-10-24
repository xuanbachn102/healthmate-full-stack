import express from 'express';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from '../controllers/notificationController.js';
import authUser from '../middleware/authUser.js';

const notificationRouter = express.Router();

// All routes require authentication
notificationRouter.get('/list', authUser, getNotifications);
notificationRouter.post('/mark-read', authUser, markAsRead);
notificationRouter.post('/mark-all-read', authUser, markAllAsRead);
notificationRouter.post('/delete', authUser, deleteNotification);

export default notificationRouter;
