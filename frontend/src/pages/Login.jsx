import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useTranslation } from 'react-i18next'

const Login = () => {
  const { t } = useTranslation()

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {

      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)

      const googleData = {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
        image: decoded.picture
      }

      const { data } = await axios.post(backendUrl + '/api/user/google-login', googleData)

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success(t('login.googleLoginSuccess'))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error(t('login.googleLoginFailed'))
    }
  }

  const handleGoogleError = () => {
    toast.error(t('login.googleLoginFailed'))
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? t('login.createAccount') : t('login.login')}</p>
        <p>{state === 'Sign Up' ? t('login.pleaseSignUp') : t('login.pleaseLogin')}</p>

        {/* Google Login Button */}
        <div className='w-full'>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <div className='w-full flex items-center gap-2'>
          <hr className='flex-1 border-gray-300' />
          <span className='text-gray-500 text-xs'>{t('login.or')}</span>
          <hr className='flex-1 border-gray-300' />
        </div>
        {state === 'Sign Up'
          ? <div className='w-full '>
            <p>{t('login.fullName')}</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
          </div>
          : null
        }
        <div className='w-full '>
          <p>{t('login.email')}</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>{t('login.password')}</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>{state === 'Sign Up' ? t('login.createAccountBtn') : t('login.loginBtn')}</button>
        {state === 'Sign Up'
          ? <p>{t('login.alreadyHaveAccount')} <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>{t('login.loginHere')}</span></p>
          : <p>{t('login.createNewAccount')} <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>{t('login.clickHere')}</span></p>
        }
      </div>
    </form>
  )
}

export default Login