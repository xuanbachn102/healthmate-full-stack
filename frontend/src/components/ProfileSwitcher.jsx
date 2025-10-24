import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const ProfileSwitcher = () => {
  const { t } = useTranslation();
  const { profiles, activeProfile, setActiveProfile } = useContext(AppContext);

  if (!profiles || profiles.length === 0) {
    return null;
  }

  const handleProfileChange = (profile) => {
    setActiveProfile(profile);
  };

  return (
    <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700'>
      {/* Profile indicator */}
      <div
        className='w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold'
        style={{ backgroundColor: activeProfile?.color || '#3B82F6' }}
      >
        {activeProfile?.name?.charAt(0).toUpperCase() || 'U'}
      </div>

      {/* Profile dropdown */}
      <select
        value={activeProfile?._id || ''}
        onChange={(e) => {
          const selected = profiles.find(p => p._id === e.target.value);
          if (selected) handleProfileChange(selected);
        }}
        className='bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none pr-2'
      >
        {profiles.map((profile) => (
          <option key={profile._id} value={profile._id}>
            {profile.name} {profile.isDefault ? '⭐' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProfileSwitcher;
