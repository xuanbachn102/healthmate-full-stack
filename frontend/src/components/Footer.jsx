import React from 'react'
import { assets } from '../assets/assets'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          {/*<img className='mb-5 w-40' src={assets.logo} alt="" />*/}
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>{t('footer.company')}</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>{t('footer.home')}</li>
            <li>{t('footer.aboutUs')}</li>
            <li>{t('footer.delivery')}</li>
            <li>{t('footer.privacyPolicy')}</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>{t('footer.getInTouch')}</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>0337714282</li>
            <li>xuanbachggl@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>{t('footer.copyright', { year: currentYear })}</p>
      </div>

    </div>
  )
}

export default Footer
