import express from 'express';
import {
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile
} from '../controllers/profileController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const profileRouter = express.Router();

// All routes require authentication
profileRouter.get('/list', authUser, getProfiles);
profileRouter.get('/:profileId', authUser, getProfile);
profileRouter.post('/create', upload.single('image'), authUser, createProfile);
profileRouter.post('/update', upload.single('image'), authUser, updateProfile);
profileRouter.post('/delete', authUser, deleteProfile);
profileRouter.post('/set-default', authUser, setDefaultProfile);

export default profileRouter;
