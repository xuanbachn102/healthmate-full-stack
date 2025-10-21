import React from 'react'
import { assets } from '../assets/assets'
import { useTranslation } from 'react-i18next'

const About = () => {
  const { t } = useTranslation()
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>{t('about.title')}</p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>{t('about.welcome')}</p>
          <p>{t('about.visionText')}</p>
          <b className='text-gray-800'>{t('about.ourVision')}</b>
          <p>{t('about.visionText')}</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>{t('about.whyChooseUs')}</p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>{t('about.efficiency')}</b>
          <p>{t('about.efficiencyText')}</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>{t('about.convenience')}</b>
          <p>{t('about.convenienceText')}</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>{t('about.personalization')}</b>
          <p>{t('about.personalizationText')}</p>
        </div>
      </div>

    </div>
  )
}

export default About
