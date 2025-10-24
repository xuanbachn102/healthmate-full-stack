import profileModel from '../models/profileModel.js';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Get all profiles for a user
 * @route GET /api/profile/list
 */
export const getProfiles = async (req, res) => {
    try {
        const { userId } = req.body;

        const profiles = await profileModel.find({ userId }).sort({ isDefault: -1, createdAt: 1 });

        res.json({
            success: true,
            profiles
        });

    } catch (error) {
        console.error('Error getting profiles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profiles'
        });
    }
};

/**
 * Get a single profile by ID
 * @route GET /api/profile/:profileId
 */
export const getProfile = async (req, res) => {
    try {
        const { profileId } = req.params;
        const { userId } = req.body;

        const profile = await profileModel.findOne({ _id: profileId, userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.json({
            success: true,
            profile
        });

    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
};

/**
 * Create a new profile
 * @route POST /api/profile/create
 */
export const createProfile = async (req, res) => {
    try {
        const { userId, name, relationship, phone, address, gender, dob, ethnicity, occupation, cccdNumber, bhytNumber, bloodType, symptoms, diseases, allergies, medications, emergencyContact, color } = req.body;
        const imageFile = req.file;

        if (!name) {
            return res.json({ success: false, message: "Name is required" });
        }

        // Check if user already has 5 profiles (limit)
        const existingProfiles = await profileModel.find({ userId });
        if (existingProfiles.length >= 5) {
            return res.json({
                success: false,
                message: "Maximum 5 profiles per account reached"
            });
        }

        // Prepare profile data
        const profileData = {
            userId,
            name,
            relationship: relationship || 'other',
            phone: phone || '',
            address: address ? JSON.parse(address) : { line1: '', line2: '' },
            gender: gender || 'Not Selected',
            dob: dob || 'Not Selected',
            ethnicity: ethnicity || 'Not Selected',
            occupation: occupation || 'Not Selected',
            cccdNumber: cccdNumber || '',
            bhytNumber: bhytNumber || '',
            bloodType: bloodType || 'Not Specified',
            symptoms: symptoms ? JSON.parse(symptoms) : [],
            diseases: diseases ? JSON.parse(diseases) : [],
            allergies: allergies ? JSON.parse(allergies) : [],
            medications: medications ? JSON.parse(medications) : [],
            emergencyContact: emergencyContact ? JSON.parse(emergencyContact) : { name: '', phone: '', relationship: '' },
            color: color || '#3B82F6',
            isDefault: existingProfiles.length === 0 // First profile is default
        };

        // Handle image upload
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            profileData.image = imageUpload.secure_url;
        }

        const newProfile = new profileModel(profileData);
        await newProfile.save();

        res.json({
            success: true,
            message: "Profile created successfully",
            profile: newProfile
        });

    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create profile'
        });
    }
};

/**
 * Update a profile
 * @route POST /api/profile/update
 */
export const updateProfile = async (req, res) => {
    try {
        const { profileId, name, relationship, phone, address, gender, dob, ethnicity, occupation, cccdNumber, bhytNumber, bloodType, symptoms, diseases, allergies, medications, emergencyContact, color } = req.body;
        const imageFile = req.file;

        if (!name) {
            return res.json({ success: false, message: "Name is required" });
        }

        const updateData = {
            name,
            relationship: relationship || 'other',
            phone: phone || '',
            address: JSON.parse(address),
            gender,
            dob,
            ethnicity,
            occupation,
            cccdNumber: cccdNumber || '',
            bhytNumber: bhytNumber || '',
            color: color || '#3B82F6'
        };

        // Add health information if provided
        if (bloodType) updateData.bloodType = bloodType;
        if (symptoms) updateData.symptoms = JSON.parse(symptoms);
        if (diseases) updateData.diseases = JSON.parse(diseases);
        if (allergies) updateData.allergies = JSON.parse(allergies);
        if (medications) updateData.medications = JSON.parse(medications);
        if (emergencyContact) updateData.emergencyContact = JSON.parse(emergencyContact);

        // Handle image upload
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        const updatedProfile = await profileModel.findByIdAndUpdate(profileId, updateData, { new: true });

        res.json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

/**
 * Delete a profile
 * @route POST /api/profile/delete
 */
export const deleteProfile = async (req, res) => {
    try {
        const { profileId, userId } = req.body;

        const profile = await profileModel.findOne({ _id: profileId, userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Don't allow deleting the default profile if there are other profiles
        if (profile.isDefault) {
            const otherProfiles = await profileModel.find({ userId, _id: { $ne: profileId } });
            if (otherProfiles.length > 0) {
                return res.json({
                    success: false,
                    message: 'Cannot delete default profile. Set another profile as default first.'
                });
            }
        }

        await profileModel.findByIdAndDelete(profileId);

        res.json({
            success: true,
            message: 'Profile deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete profile'
        });
    }
};

/**
 * Set a profile as default
 * @route POST /api/profile/set-default
 */
export const setDefaultProfile = async (req, res) => {
    try {
        const { profileId, userId } = req.body;

        // Remove default from all profiles
        await profileModel.updateMany({ userId }, { isDefault: false });

        // Set new default
        await profileModel.findByIdAndUpdate(profileId, { isDefault: true });

        res.json({
            success: true,
            message: 'Default profile updated'
        });

    } catch (error) {
        console.error('Error setting default profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to set default profile'
        });
    }
};
