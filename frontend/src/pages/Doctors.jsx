import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Doctors = () => {

  const { t } = useTranslation()
  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600 dark:text-gray-200'>{t('doctors.title')}</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 ${showFilter ? 'bg-primary text-white' : ''}`}>{t('doctors.filters')}</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 dark:text-gray-200 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer dark:text-gray-200 ${speciality === 'General physician' ? 'bg-[#E2E5FF] text-black ' : ''}`}>{t('speciality.generalPhysician')}</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer dark:text-gray-200 ${speciality === 'Gynecologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>{t('speciality.gynecologist')}</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer dark:text-gray-200 ${speciality === 'Dermatologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>{t('speciality.dermatologist')}</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer dark:text-gray-200 ${speciality === 'Pediatricians' ? 'bg-[#E2E5FF] text-black ' : ''}`}>{t('speciality.pediatricians')}</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer dark:text-gray-200 ${speciality === 'Neurologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>{t('speciality.neurologist')}</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer dark:text-gray-200 ${speciality === 'Gastroenterologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>{t('speciality.gastroenterologist')}</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] dark:border-gray-700 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-[#EAEFFF]' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500 dark:text-gray-400"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? t('doctors.available') : t('doctors.notAvailable')}</p>
                </div>
                <p className='text-[#262626] dark:text-white text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] dark:text-gray-300 text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors