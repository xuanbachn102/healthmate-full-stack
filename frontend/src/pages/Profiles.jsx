import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profiles = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, backendUrl, profiles: contextProfiles, loadProfiles } = useContext(AppContext);

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    relationship: 'other',
    color: '#3B82F6'
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
    setProfiles(contextProfiles || []);
  }, [contextProfiles]);

  const handleCreateProfile = async () => {
    if (!newProfile.name.trim()) {
      toast.error(t('profiles.nameRequired') || 'Tên là bắt buộc');
      return;
    }

    if (profiles.length >= 5) {
      toast.error(t('profiles.maxProfilesReached') || 'Đã đạt giới hạn 5 hồ sơ');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newProfile.name);
      formData.append('relationship', newProfile.relationship);
      formData.append('color', newProfile.color);

      const { data } = await axios.post(`${backendUrl}/api/profile/create`, formData, {
        headers: { token }
      });

      if (data.success) {
        toast.success(t('profiles.profileCreated') || 'Tạo hồ sơ thành công');
        setShowCreateModal(false);
        setNewProfile({ name: '', relationship: 'other', color: '#3B82F6' });
        loadProfiles(); // Reload from context
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (!confirm(t('profiles.confirmDelete') || 'Bạn có chắc muốn xóa hồ sơ này?')) {
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/profile/delete`,
        { profileId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(t('profiles.profileDeleted') || 'Đã xóa hồ sơ');
        loadProfiles(); // Reload from context
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  const handleSetDefault = async (profileId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/profile/set-default`,
        { profileId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(t('profiles.defaultUpdated') || 'Đã cập nhật hồ sơ mặc định');
        loadProfiles(); // Reload from context
      }
    } catch (error) {
      console.error('Error setting default:', error);
      toast.error('Failed to set default');
    }
  };

  if (!token) {
    return (
      <div className='text-center py-20'>
        <p className='text-gray-600 dark:text-gray-400'>{t('common.pleaseLogin') || 'Vui lòng đăng nhập'}</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              {t('profiles.title') || 'Quản lý hồ sơ'}
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              {t('profiles.subtitle') || 'Quản lý hồ sơ sức khỏe cho gia đình'}
            </p>
          </div>

          {profiles.length < 5 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all'
            >
              + {t('profiles.addProfile') || 'Thêm hồ sơ'}
            </button>
          )}
        </div>

        {/* Profiles Grid */}
        {loading ? (
          <div className='flex justify-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          </div>
        ) : profiles.length === 0 ? (
          <div className='text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              {t('profiles.noProfiles') || 'Chưa có hồ sơ nào'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all'
            >
              {t('profiles.createFirst') || 'Tạo hồ sơ đầu tiên'}
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {profiles.map((profile) => (
              <div
                key={profile._id}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all'
                style={{ borderTop: `4px solid ${profile.color}` }}
              >
                <div className='p-6'>
                  {/* Profile Header */}
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className='w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl'
                        style={{ backgroundColor: profile.color }}
                      >
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {profile.name}
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          {relationships.find(r => r.value === profile.relationship)?.label}
                        </p>
                      </div>
                    </div>
                    {profile.isDefault && (
                      <span className='px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full'>
                        {t('profiles.default') || 'Mặc định'}
                      </span>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className='space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4'>
                    {profile.phone && (
                      <p>📱 {profile.phone}</p>
                    )}
                    {profile.dob && profile.dob !== 'Not Selected' && (
                      <p>🎂 {profile.dob}</p>
                    )}
                    {profile.bloodType && profile.bloodType !== 'Not Specified' && (
                      <p>🩸 {profile.bloodType}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2'>
                    <button
                      onClick={() => navigate(`/profile/${profile._id}`)}
                      className='flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all text-sm'
                    >
                      {t('profiles.viewEdit') || 'Xem/Sửa'}
                    </button>

                    {!profile.isDefault && (
                      <button
                        onClick={() => handleSetDefault(profile._id)}
                        className='px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm'
                        title={t('profiles.setAsDefault') || 'Đặt làm mặc định'}
                      >
                        ⭐
                      </button>
                    )}

                    {profiles.length > 1 && (
                      <button
                        onClick={() => handleDeleteProfile(profile._id)}
                        className='px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm'
                        title={t('profiles.delete') || 'Xóa'}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className='mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
          <p className='text-sm text-blue-800 dark:text-blue-200'>
            ℹ️ {t('profiles.info') || 'Bạn có thể tạo tối đa 5 hồ sơ cho gia đình. Mỗi hồ sơ có thể có thông tin sức khỏe riêng.'}
          </p>
        </div>
      </div>

      {/* Create Profile Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              {t('profiles.createNew') || 'Tạo hồ sơ mới'}
            </h2>

            <div className='space-y-4'>
              {/* Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('profiles.name') || 'Tên'} *
                </label>
                <input
                  type='text'
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  placeholder='Nguyễn Văn A'
                />
              </div>

              {/* Relationship */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('profiles.relationship') || 'Mối quan hệ'}
                </label>
                <select
                  value={newProfile.relationship}
                  onChange={(e) => setNewProfile({ ...newProfile, relationship: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                >
                  {relationships.map(rel => (
                    <option key={rel.value} value={rel.value}>{rel.label}</option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('profiles.color') || 'Màu sắc'}
                </label>
                <div className='flex gap-2 flex-wrap'>
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewProfile({ ...newProfile, color })}
                      className={`w-10 h-10 rounded-full border-2 ${newProfile.color === color ? 'border-gray-900 dark:border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewProfile({ name: '', relationship: 'other', color: '#3B82F6' });
                }}
                className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all'
              >
                {t('common.cancel') || 'Hủy'}
              </button>
              <button
                onClick={handleCreateProfile}
                className='flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all'
              >
                {t('profiles.create') || 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profiles;
