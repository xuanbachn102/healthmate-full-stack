import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: String,
        enum: ['appointment_reminder', 'appointment_confirmed', 'appointment_cancelled', 'payment_success', 'general'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointment',
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

// Index for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema);

export default notificationModel;
