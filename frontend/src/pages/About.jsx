import React from 'react'
import { assets } from '../assets/assets'
import { useTranslation } from 'react-i18next'

const About = () => {
  const { t } = useTranslation()
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070] dark:text-gray-200'>
        <p>{t('about.title')}</p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 dark:text-gray-200'>
          <p>{t('about.welcome')}</p>
          <p>{t('about.visionText')}</p>
          <b className='text-gray-800 dark:text-white'>{t('about.ourVision')}</b>
          <p>{t('about.visionText')}</p>
        </div>
      </div>

      <div className='text-xl my-4 dark:text-white'>
        <p>{t('about.whyChooseUs')}</p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border dark:border-gray-700 dark:bg-gray-800 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-200 cursor-pointer'>
          <b className='dark:text-white'>{t('about.efficiency')}</b>
          <p>{t('about.efficiencyText')}</p>
        </div>
        <div className='border dark:border-gray-700 dark:bg-gray-800 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-200 cursor-pointer'>
          <b className='dark:text-white'>{t('about.convenience')}</b>
          <p>{t('about.convenienceText')}</p>
        </div>
        <div className='border dark:border-gray-700 dark:bg-gray-800 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-200 cursor-pointer'>
          <b className='dark:text-white'>{t('about.personalization')}</b>
          <p>{t('about.personalizationText')}</p>
        </div>
      </div>

    </div>
  )
}

export default About
