import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { token, backendUrl } = useContext(AppContext);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/change-password`,
        { currentPassword, newPassword },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className='text-center py-20'>
        <p className='text-gray-600 dark:text-gray-400'>Please login to access settings</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>Settings</h1>

      {/* Appearance Section */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2'>
          Appearance
        </h2>

        <div className='space-y-4'>
          {/* Theme */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium text-gray-900 dark:text-white'>Theme</p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Choose your preferred theme</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Language */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium text-gray-900 dark:text-white'>Language</p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Select your language</p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2'>
          Security
        </h2>

        <form onSubmit={handleChangePassword} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Current Password
            </label>
            <input
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
              placeholder='Enter current password'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              New Password
            </label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
              placeholder='Enter new password (min. 8 characters)'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Confirm New Password
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
              placeholder='Confirm new password'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
