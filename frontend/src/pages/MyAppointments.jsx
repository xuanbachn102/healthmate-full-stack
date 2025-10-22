import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const MyAppointments = () => {

    const { t } = useTranslation()
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Function to make payment using MoMo
    const appointmentMoMo = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-momo', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { payUrl } = data
                window.location.replace(payUrl)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 dark:text-white border-b dark:border-gray-700'>{t('myAppointments.title')}</p>
            <div className=''>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b dark:border-gray-700'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E] dark:text-gray-300'>
                            <p className='text-[#262626] dark:text-white text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] dark:text-gray-200 font-medium mt-1'>{t('myAppointments.address')}</p>
                            <p className=''>{item.docData.address.line1}</p>
                            <p className=''>{item.docData.address.line2}</p>
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] dark:text-gray-200 font-medium'>{t('myAppointments.dateTime')}</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentMoMo(item._id)} className='text-white bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800 sm:min-w-48 py-2 border border-pink-600 dark:border-pink-700 rounded hover:bg-pink-700 transition-all duration-300 flex items-center justify-center gap-2'>
                                <span className='font-semibold'>MoMo</span>
                                <span>{t('myAppointments.payOnline')}</span>
                            </button>}
                            {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border dark:border-gray-700 rounded text-[#696969] dark:text-gray-200 bg-[#EAEFFF] dark:bg-gray-700'>{t('myAppointments.paid')}</button>}

                            {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 dark:border-green-600 rounded text-green-500 dark:text-green-400'>{t('myAppointments.completed')}</button>}

                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] dark:text-gray-200 dark:border-gray-700 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>{t('myAppointments.cancelAppointment')}</button>}
                            {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 dark:border-red-600 rounded text-red-500 dark:text-red-400'>{t('myAppointments.appointmentCancelled')}</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments