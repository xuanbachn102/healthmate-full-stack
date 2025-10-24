import React from 'react'
import { assets } from '../assets/assets'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 my-10 mt-40 text-sm'>

        {/* Company Info */}
        <div>
          <img className='mb-5 w-40 dark:invert dark:brightness-0 dark:contrast-200' src={assets.logo} alt="HealthMate" />
          <p className='font-semibold text-gray-900 dark:text-white mb-2'>{t('footer.companyName')}</p>
          <div className='text-gray-600 dark:text-gray-300 leading-6 space-y-2'>
            <p>{t('footer.address')}</p>
            <p>{t('footer.hotline')}</p>
            <p className='text-xs mt-3'>{t('footer.businessLicense')}</p>
          </div>
        </div>

        {/* About */}
        <div>
          <p className='text-lg font-semibold mb-4 dark:text-white'>{t('footer.aboutTitle')}</p>
          <ul className='flex flex-col gap-2 text-gray-600 dark:text-gray-300'>
            <li className='hover:text-primary cursor-pointer'>{t('footer.about')}</li>
            <li className='hover:text-primary cursor-pointer'>{t('footer.management')}</li>
            <li className='hover:text-primary cursor-pointer'>{t('footer.careers')}</li>
            <li className='hover:text-primary cursor-pointer'>{t('footer.contact')}</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <p className='text-lg font-semibold mb-4 dark:text-white'>{t('footer.servicesTitle')}</p>
          <ul className='flex flex-col gap-2 text-gray-600 dark:text-gray-300'>
            <li className='hover:text-primary cursor-pointer'>{t('footer.bookDoctor')}</li>
            <li className='hover:text-primary cursor-pointer'>{t('footer.bookHospital')}</li>
            <li className='hover:text-primary cursor-pointer'>{t('footer.bookClinic')}</li>
            <li className='hover:text-primary cursor-pointer'>{t('footer.symptomChecker')}</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className='text-lg font-semibold mb-4 dark:text-white'>{t('footer.supportTitle')}</p>
          <ul className='flex flex-col gap-2 text-gray-600 dark:text-gray-300'>
            <li className='hover:text-primary cursor-pointer'>{t('footer.terms')}</li>
            <li className='hover:text-primary cursor-pointer'>{t('footer.privacy')}</li>
            <li className='hover:text-primary cursor-pointer'>{t('footer.complaint')}</li>
            <li className='text-primary'>cskh@healthmate.vn</li>
          </ul>
        </div>

      </div>

      {/* Disclaimer & Copyright */}
      <div>
        <hr className='dark:border-gray-700' />
        <div className='py-5 text-xs text-gray-600 dark:text-gray-400 space-y-3'>
          <p className='text-center'>{t('footer.disclaimer')}</p>
          <p className='text-center font-medium text-gray-900 dark:text-white'>
            {t('footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>

    </div>
  )
}

export default Footer
