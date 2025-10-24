import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const ProfileEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profileId } = useParams();
  const { token, backendUrl } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    relationship: 'other',
    color: '#3B82F6',
    image: null,
    phone: '',
    address: { line1: '', line2: '' },
    gender: 'Not Selected',
    dob: 'Not Selected',
    ethnicity: '',
    occupation: '',
    cccdNumber: '',
    bhytNumber: '',
    bloodType: 'Not Specified',
    symptoms: [],
    diseases: [],
    allergies: [],
    medications: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const relationships = [
    { value: 'self', label: t('profiles.self') || 'Bản thân' },
    { value: 'spouse', label: t('profiles.spouse') || 'Vợ/Chồng' },
    { value: 'child', label: t('profiles.child') || 'Con' },
    { value: 'parent', label: t('profiles.parent') || 'Cha/Mẹ' },
    { value: 'sibling', label: t('profiles.sibling') || 'Anh/Chị/Em' },
    { value: 'other', label: t('profiles.other') || 'Khác' }
  ];

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  useEffect(() => {
    if (token && profileId) {
      loadProfileData();
    }
  }, [token, profileId]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/profile/${profileId}`, {
        headers: { token }
      });

      if (data.success) {
        setProfileData(data.profile);
      } else {
        toast.error(data.message);
        navigate('/profiles');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
      navigate('/profiles');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('profileId', profileId);
      formData.append('name', profileData.name);
      formData.append('relationship', profileData.relationship);
      formData.append('color', profileData.color);
      formData.append('phone', profileData.phone || '');
      formData.append('address', JSON.stringify(profileData.address));
      formData.append('gender', profileData.gender);
      formData.append('dob', profileData.dob);
      formData.append('ethnicity', profileData.ethnicity || '');
      formData.append('occupation', profileData.occupation || '');
      formData.append('cccdNumber', profileData.cccdNumber || '');
      formData.append('bhytNumber', profileData.bhytNumber || '');
      formData.append('bloodType', profileData.bloodType);
      formData.append('symptoms', JSON.stringify(profileData.symptoms));
      formData.append('diseases', JSON.stringify(profileData.diseases));
      formData.append('allergies', JSON.stringify(profileData.allergies));
      formData.append('medications', JSON.stringify(profileData.medications));
      formData.append('emergencyContact', JSON.stringify(profileData.emergencyContact));

      if (profileData.image instanceof File) {
        formData.append('image', profileData.image);
      }

      const { data } = await axios.post(`${backendUrl}/api/profile/update`, formData, {
        headers: { token }
      });

      if (data.success) {
        toast.success('Profile updated successfully');
        setIsEdit(false);
        loadProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (!token) {
    return (
      <div className='text-center py-20'>
        <p className='text-gray-600 dark:text-gray-400'>{t('login.pleaseLogin')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex justify-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-8'>
        <button
          onClick={() => navigate('/profiles')}
          className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'
        >
          <svg className='w-6 h-6 text-gray-600 dark:text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </button>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{profileData.name}</h1>
          <p className='text-gray-600 dark:text-gray-400'>
            {relationships.find(r => r.value === profileData.relationship)?.label}
          </p>
        </div>
        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all'
          >
            {t('myProfile.edit')}
          </button>
        )}
      </div>

      {/* Profile Image */}
      <div className='flex items-center gap-6 mb-8'>
        <div className='relative'>
          {profileData.image ? (
            <img
              className='w-32 h-32 rounded-full object-cover border-4'
              style={{ borderColor: profileData.color }}
              src={profileData.image instanceof File ? URL.createObjectURL(profileData.image) : profileData.image}
              alt={profileData.name}
            />
          ) : (
            <div
              className='w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold'
              style={{ backgroundColor: profileData.color }}
            >
              {profileData.name.charAt(0).toUpperCase()}
            </div>
          )}
          {isEdit && (
            <label htmlFor='image' className='absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-all'>
              <img src={assets.upload_icon} className='w-4' alt='Upload' />
              <input
                onChange={(e) => setProfileData(prev => ({ ...prev, image: e.target.files[0] }))}
                type='file'
                id='image'
                hidden
              />
            </label>
          )}
        </div>
        {isEdit && (
          <div>
            <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('profiles.color')}</p>
            <div className='flex gap-2 flex-wrap'>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setProfileData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${profileData.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md'>
        <p className='text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4'>
          {t('myProfile.contactInfo')}
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.phone')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={profileData.phone || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t('myProfile.phonePlaceholder')}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.phone || t('myProfile.notProvided')}</p>
            )}
          </div>
          <div className='md:col-span-2'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.address')}</p>
            {isEdit ? (
              <div className='space-y-2 mt-1'>
                <input
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  type='text'
                  value={profileData.address?.line1 || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                  placeholder={t('myProfile.addressLine1')}
                />
                <input
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  type='text'
                  value={profileData.address?.line2 || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                  placeholder={t('myProfile.addressLine2')}
                />
              </div>
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>
                {profileData.address?.line1 || profileData.address?.line2
                  ? `${profileData.address.line1 || ''} ${profileData.address.line2 || ''}`
                  : t('myProfile.notProvided')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md'>
        <p className='text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4'>
          {t('myProfile.basicInfo')}
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.gender')}</p>
            {isEdit ? (
              <select
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                value={profileData.gender}
                onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value='Not Selected'>{t('myProfile.notSelected')}</option>
                <option value='Male'>{t('myProfile.male')}</option>
                <option value='Female'>{t('myProfile.female')}</option>
              </select>
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.gender === 'Male' ? t('myProfile.male') : profileData.gender === 'Female' ? t('myProfile.female') : t('myProfile.notSelected')}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.birthday')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='date'
                value={profileData.dob === 'Not Selected' ? '' : profileData.dob}
                onChange={(e) => setProfileData(prev => ({ ...prev, dob: e.target.value || 'Not Selected' }))}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.dob === 'Not Selected' ? t('myProfile.notSelected') : profileData.dob}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.ethnicity')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={profileData.ethnicity || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, ethnicity: e.target.value }))}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.ethnicity || t('myProfile.notProvided')}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.occupation')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={profileData.occupation || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.occupation || t('myProfile.notProvided')}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.cccdNumber')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={profileData.cccdNumber || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, cccdNumber: e.target.value }))}
                placeholder='001234567890'
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.cccdNumber || t('myProfile.notProvided')}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.bhytNumber')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={profileData.bhytNumber || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, bhytNumber: e.target.value }))}
                placeholder='AB1234567890123'
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.bhytNumber || t('myProfile.notProvided')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md'>
        <p className='text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4'>
          {t('myProfile.healthInfo')}
        </p>
        <div className='space-y-4'>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.bloodType')}</p>
            {isEdit ? (
              <select
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                value={profileData.bloodType}
                onChange={(e) => setProfileData(prev => ({ ...prev, bloodType: e.target.value }))}
              >
                <option value='Not Specified'>{t('myProfile.notSpecified')}</option>
                <option value='A+'>A+</option>
                <option value='A-'>A-</option>
                <option value='B+'>B+</option>
                <option value='B-'>B-</option>
                <option value='AB+'>AB+</option>
                <option value='AB-'>AB-</option>
                <option value='O+'>O+</option>
                <option value='O-'>O-</option>
              </select>
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.bloodType}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.symptoms')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={Array.isArray(profileData.symptoms) ? profileData.symptoms.join(', ') : ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, symptoms: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                placeholder={t('myProfile.symptomsPlaceholder')}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>
                {Array.isArray(profileData.symptoms) && profileData.symptoms.length > 0 ? profileData.symptoms.join(', ') : t('myProfile.notSet')}
              </p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.diseases')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={Array.isArray(profileData.diseases) ? profileData.diseases.join(', ') : ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, diseases: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                placeholder={t('myProfile.diseasesPlaceholder')}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>
                {Array.isArray(profileData.diseases) && profileData.diseases.length > 0 ? profileData.diseases.join(', ') : t('myProfile.notSet')}
              </p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.allergies')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={Array.isArray(profileData.allergies) ? profileData.allergies.join(', ') : ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                placeholder={t('myProfile.allergiesPlaceholder')}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>
                {Array.isArray(profileData.allergies) && profileData.allergies.length > 0 ? profileData.allergies.join(', ') : t('myProfile.notSet')}
              </p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.medications')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={Array.isArray(profileData.medications) ? profileData.medications.join(', ') : ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, medications: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                placeholder={t('myProfile.medicationsPlaceholder')}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>
                {Array.isArray(profileData.medications) && profileData.medications.length > 0 ? profileData.medications.join(', ') : t('myProfile.notSet')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md'>
        <p className='text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4'>
          {t('myProfile.emergencyContact')}
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.emergencyName')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={profileData.emergencyContact?.name || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, name: e.target.value } }))}
                placeholder={t('myProfile.namePlaceholder')}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.emergencyContact?.name || t('myProfile.notSet')}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.emergencyPhone')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={profileData.emergencyContact?.phone || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, phone: e.target.value } }))}
                placeholder={t('myProfile.phonePlaceholder')}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.emergencyContact?.phone || t('myProfile.notSet')}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('myProfile.emergencyRelationship')}</p>
            {isEdit ? (
              <input
                className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                type='text'
                value={profileData.emergencyContact?.relationship || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, relationship: e.target.value } }))}
                placeholder={t('myProfile.relationshipPlaceholder')}
              />
            ) : (
              <p className='mt-1 text-gray-900 dark:text-white'>{profileData.emergencyContact?.relationship || t('myProfile.notSet')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEdit && (
        <div className='flex gap-4 justify-end'>
          <button
            onClick={() => {
              setIsEdit(false);
              loadProfileData();
            }}
            className='px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all'
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={updateProfile}
            className='px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all'
          >
            {t('myProfile.saveInfo')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
