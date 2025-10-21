import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useTranslation } from 'react-i18next'

const MyProfile = () => {

    const { t } = useTranslation()

    const [isEdit, setIsEdit] = useState(false)

    const [image, setImage] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    // Function to update user profile data using API
    const updateUserProfileData = async () => {

        try {

            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            // Add health information
            formData.append('bloodType', userData.bloodType || t('myProfile.notSpecified'))
            formData.append('symptoms', JSON.stringify(userData.symptoms || []))
            formData.append('diseases', JSON.stringify(userData.diseases || []))
            formData.append('allergies', JSON.stringify(userData.allergies || []))
            formData.append('medications', JSON.stringify(userData.medications || []))
            formData.append('emergencyContact', JSON.stringify(userData.emergencyContact || { name: '', phone: '', relationship: '' }))

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    return userData ? (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

            {isEdit
                ? <label htmlFor='image' >
                    <div className='inline-block relative cursor-pointer'>
                        <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                        <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
                : <img className='w-36 rounded' src={userData.image} alt="" />
            }

            {isEdit
                ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
            }

            <hr className='bg-[#ADADAD] h-[1px] border-none' />

            <div>
                <p className='text-gray-600 underline mt-3'>{t('myProfile.contactInfo')}</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>{t('myProfile.emailId')}</p>
                    <p className='text-blue-500'>{userData.email}</p>
                    <p className='font-medium'>{t('myProfile.phone')}</p>

                    {isEdit
                        ? <input className='bg-gray-50 max-w-52' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                        : <p className='text-blue-500'>{userData.phone}</p>
                    }

                    <p className='font-medium'>{t('myProfile.address')}</p>

                    {isEdit
                        ? <p>
                            <input className='bg-gray-50' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
                            <br />
                            <input className='bg-gray-50' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} /></p>
                        : <p className='text-gray-500'>{userData.address.line1} <br /> {userData.address.line2}</p>
                    }

                </div>
            </div>
            <div>
                <p className='text-[#797979] underline mt-3'>{t('myProfile.basicInfo')}</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>{t('myProfile.gender')}</p>

                    {isEdit
                        ? <select className='max-w-20 bg-gray-50' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
                            <option value="Not Selected">{t('myProfile.notSelected')}</option>
                            <option value="Male">{t('myProfile.male')}</option>
                            <option value="Female">{t('myProfile.female')}</option>
                        </select>
                        : <p className='text-gray-500'>{userData.gender}</p>
                    }

                    <p className='font-medium'>{t('myProfile.birthday')}</p>

                    {isEdit
                        ? <input className='max-w-28 bg-gray-50' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                        : <p className='text-gray-500'>{userData.dob}</p>
                    }

                </div>
            </div>

            <div>
                <p className='text-[#797979] underline mt-3'>{t('myProfile.healthInfo')}</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>{t('myProfile.bloodType')}</p>

                    {isEdit
                        ? <select className='max-w-32 bg-gray-50' onChange={(e) => setUserData(prev => ({ ...prev, bloodType: e.target.value }))} value={userData.bloodType || t('myProfile.notSpecified')} >
                            <option value="Not Specified">{t('myProfile.notSpecified')}</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        : <p className='text-gray-500'>{userData.bloodType || t('myProfile.notSpecified')}</p>
                    }

                    <p className='font-medium'>{t('myProfile.symptoms')}</p>

                    {isEdit
                        ? <textarea className='bg-gray-50 max-w-md' rows="2" placeholder={t('myProfile.symptomsPlaceholder')} onChange={(e) => setUserData(prev => ({ ...prev, symptoms: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))} value={userData.symptoms?.join(', ') || ''} />
                        : <p className='text-gray-500'>{userData.symptoms?.join(', ') || t('myProfile.notSet')}</p>
                    }

                    <p className='font-medium'>{t('myProfile.diseases')}</p>

                    {isEdit
                        ? <textarea className='bg-gray-50 max-w-md' rows="2" placeholder={t('myProfile.diseasesPlaceholder')} onChange={(e) => setUserData(prev => ({ ...prev, diseases: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))} value={userData.diseases?.join(', ') || ''} />
                        : <p className='text-gray-500'>{userData.diseases?.join(', ') || t('myProfile.notSet')}</p>
                    }

                    <p className='font-medium'>{t('myProfile.allergies')}</p>

                    {isEdit
                        ? <textarea className='bg-gray-50 max-w-md' rows="2" placeholder={t('myProfile.allergiesPlaceholder')} onChange={(e) => setUserData(prev => ({ ...prev, allergies: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))} value={userData.allergies?.join(', ') || ''} />
                        : <p className='text-gray-500'>{userData.allergies?.join(', ') || t('myProfile.notSet')}</p>
                    }

                    <p className='font-medium'>{t('myProfile.medications')}</p>

                    {isEdit
                        ? <textarea className='bg-gray-50 max-w-md' rows="2" placeholder={t('myProfile.medicationsPlaceholder')} onChange={(e) => setUserData(prev => ({ ...prev, medications: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))} value={userData.medications?.join(', ') || ''} />
                        : <p className='text-gray-500'>{userData.medications?.join(', ') || t('myProfile.notSet')}</p>
                    }

                </div>
            </div>

            <div>
                <p className='text-[#797979] underline mt-3'>{t('myProfile.emergencyContact')}</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>{t('myProfile.emergencyName')}</p>

                    {isEdit
                        ? <input className='bg-gray-50 max-w-52' type="text" placeholder={t('myProfile.namePlaceholder')} onChange={(e) => setUserData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, name: e.target.value } }))} value={userData.emergencyContact?.name || ''} />
                        : <p className='text-gray-500'>{userData.emergencyContact?.name || t('myProfile.notSet')}</p>
                    }

                    <p className='font-medium'>{t('myProfile.emergencyPhone')}</p>

                    {isEdit
                        ? <input className='bg-gray-50 max-w-52' type="text" placeholder={t('myProfile.phonePlaceholder')} onChange={(e) => setUserData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, phone: e.target.value } }))} value={userData.emergencyContact?.phone || ''} />
                        : <p className='text-gray-500'>{userData.emergencyContact?.phone || t('myProfile.notSet')}</p>
                    }

                    <p className='font-medium'>{t('myProfile.emergencyRelationship')}</p>

                    {isEdit
                        ? <input className='bg-gray-50 max-w-52' type="text" placeholder={t('myProfile.relationshipPlaceholder')} onChange={(e) => setUserData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, relationship: e.target.value } }))} value={userData.emergencyContact?.relationship || ''} />
                        : <p className='text-gray-500'>{userData.emergencyContact?.relationship || t('myProfile.notSet')}</p>
                    }

                </div>
            </div>

            <div className='mt-10'>

                {isEdit
                    ? <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>{t('myProfile.saveInfo')}</button>
                    : <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>{t('myProfile.edit')}</button>
                }

            </div>
        </div>
    ) : null
}

export default MyProfile