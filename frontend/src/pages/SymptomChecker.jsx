import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const SymptomChecker = () => {
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // Multi-step form
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '',
    severity: 'Moderate',
    age: '',
    gender: ''
  })
  const [result, setResult] = useState(null)
  const [remainingChecks, setRemainingChecks] = useState(null)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = () => {
    if (step === 1 && !formData.symptoms.trim()) {
      toast.error('Please describe your symptoms')
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const { data } = await axios.post(
        backendUrl + '/api/user/analyze-symptoms',
        formData,
        { headers: { token } }
      )

      if (data.success) {
        setResult(data.data)
        setRemainingChecks(data.remainingChecks)
        setStep(4) // Go to results page
        toast.success('Analysis complete!')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = () => {
    if (result && result.specialty) {
      // Navigate to doctors page filtered by specialty
      navigate(`/doctors?specialty=${result.specialty}`)
    }
  }

  const handleNewCheck = () => {
    setFormData({
      symptoms: '',
      duration: '',
      severity: 'Moderate',
      age: '',
      gender: ''
    })
    setResult(null)
    setStep(1)
  }

  return (
    <div className='min-h-screen py-10 px-4 sm:px-8 md:px-16 bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2'>
            AI Symptom Checker
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Get personalized specialty recommendations based on your symptoms
          </p>
          {remainingChecks !== null && (
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              Remaining checks today: {remainingChecks}/20
            </p>
          )}
        </div>

        {/* Medical Disclaimer */}
        <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-8'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-yellow-700 dark:text-yellow-300'>
                <strong>Medical Disclaimer:</strong> This tool provides general health information only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
              </p>
              <p className='text-sm text-yellow-700 dark:text-yellow-300 mt-1'>
                <strong>Emergency:</strong> If experiencing chest pain, difficulty breathing, severe bleeding, or loss of consciousness, call emergency services immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Step Form */}
        {step < 4 && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8'>
            {/* Progress Bar */}
            <div className='mb-8'>
              <div className='flex justify-between mb-2'>
                <span className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
                  Symptoms
                </span>
                <span className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
                  Details
                </span>
                <span className={`text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
                  Personal Info
                </span>
              </div>
              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                <div
                  className='bg-primary h-2 rounded-full transition-all duration-300'
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Symptoms */}
            {step === 1 && (
              <div>
                <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>
                  What symptoms are you experiencing?
                </h2>
                <p className='text-gray-600 dark:text-gray-300 mb-4'>
                  Describe your symptoms in detail. Include any pain, discomfort, or changes you've noticed.
                </p>
                <textarea
                  name='symptoms'
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows='6'
                  placeholder='E.g., I have a persistent headache and feel dizzy. I also have nausea...'
                  className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white'
                />
                <button
                  onClick={handleNext}
                  className='mt-6 w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all'
                >
                  Next
                </button>
              </div>
            )}

            {/* Step 2: Duration & Severity */}
            {step === 2 && (
              <div>
                <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>
                  How long have you had these symptoms?
                </h2>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-gray-700 dark:text-gray-200 mb-2'>
                      Duration
                    </label>
                    <select
                      name='duration'
                      value={formData.duration}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white'
                    >
                      <option value=''>Select duration</option>
                      <option value='Less than 1 day'>Less than 1 day</option>
                      <option value='1-3 days'>1-3 days</option>
                      <option value='4-7 days'>4-7 days</option>
                      <option value='1-2 weeks'>1-2 weeks</option>
                      <option value='2-4 weeks'>2-4 weeks</option>
                      <option value='More than 1 month'>More than 1 month</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-gray-700 dark:text-gray-200 mb-2'>
                      Severity
                    </label>
                    <div className='flex gap-4'>
                      {['Mild', 'Moderate', 'Severe'].map((level) => (
                        <button
                          key={level}
                          type='button'
                          onClick={() => setFormData({ ...formData, severity: level })}
                          className={`flex-1 py-3 rounded-md border-2 transition-all ${
                            formData.severity === level
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex gap-4 mt-6'>
                  <button
                    onClick={handleBack}
                    className='px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all'
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className='flex-1 px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all'
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Personal Info */}
            {step === 3 && (
              <div>
                <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>
                  Personal Information (Optional)
                </h2>
                <p className='text-gray-600 dark:text-gray-300 mb-4'>
                  This helps provide more accurate recommendations. You can skip if you prefer.
                </p>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-gray-700 dark:text-gray-200 mb-2'>
                      Age
                    </label>
                    <select
                      name='age'
                      value={formData.age}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white'
                    >
                      <option value=''>Select age (optional)</option>
                      {[...Array(101)].map((_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-gray-700 dark:text-gray-200 mb-2'>
                      Gender
                    </label>
                    <select
                      name='gender'
                      value={formData.gender}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white'
                    >
                      <option value=''>Select gender (optional)</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                      <option value='Other'>Other</option>
                    </select>
                  </div>
                </div>
                <div className='flex gap-4 mt-6'>
                  <button
                    onClick={handleBack}
                    className='px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all'
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className='flex-1 px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed'
                  >
                    {loading ? 'Analyzing...' : 'Get Results'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {step === 4 && result && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8'>
            <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-6'>
              Analysis Results
            </h2>

            {/* Emergency Warning */}
            {result.urgency === 'emergency' && (
              <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg className='h-5 w-5 text-red-500' viewBox='0 0 20 20' fill='currentColor'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-red-700 dark:text-red-300 font-bold'>
                      EMERGENCY DETECTED
                    </p>
                    <p className='text-sm text-red-700 dark:text-red-300'>
                      {result.emergencyWarning || 'Please seek immediate medical attention immediately.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Specialty */}
            <div className='bg-primary/10 border border-primary rounded-lg p-6 mb-6'>
              <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
                Recommended Specialty
              </h3>
              <p className='text-3xl font-bold text-primary mb-2'>{result.specialty}</p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Urgency: <span className={`font-semibold ${
                  result.urgency === 'emergency' ? 'text-red-600' :
                  result.urgency === 'urgent' ? 'text-orange-600' :
                  'text-green-600'
                }`}>{result.urgency.charAt(0).toUpperCase() + result.urgency.slice(1)}</span>
              </p>
            </div>

            {/* Symptom Summary */}
            {result.symptomSummary && (
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
                  Mô tả triệu chứng
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  {result.symptomSummary}
                </p>
              </div>
            )}

            {/* Possible Causes */}
            {result.possibleCauses && result.possibleCauses.length > 0 && (
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>
                  Nguyên nhân có thể
                </h3>
                <ol className='list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300'>
                  {result.possibleCauses.map((cause, index) => (
                    <li key={index} className='leading-relaxed'>
                      {cause}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Related Conditions */}
            {result.relatedConditions && result.relatedConditions.length > 0 && (
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>
                  Các bệnh liên quan
                </h3>
                <ul className='list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300'>
                  {result.relatedConditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Medical Info */}
            {result.medicalInfo && (
              <div className='mb-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
                  Thông tin y tế
                </h3>
                <p className='text-gray-700 dark:text-gray-300 italic'>
                  {result.medicalInfo}
                </p>
              </div>
            )}

            {/* Reasoning */}
            <div className='mb-6'>
              <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
                Tại sao chuyên khoa này?
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                {result.reasoning}
              </p>
            </div>

            {/* Immediate Actions */}
            {result.immediateActions && result.immediateActions.length > 0 && (
              <div className='mb-6 bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>
                  Điều trị/Quản lý
                </h3>
                <ul className='space-y-2 text-gray-600 dark:text-gray-300'>
                  {result.immediateActions.map((action, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='text-green-600 mr-2'>•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Advice */}
            {result.additionalAdvice && (
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
                  Lời khuyên thêm
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  {result.additionalAdvice}
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className='bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {result.disclaimer}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <button
                onClick={handleBookAppointment}
                className='flex-1 px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all'
              >
                Book Appointment
              </button>
              <button
                onClick={handleNewCheck}
                className='px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all'
              >
                New Check
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SymptomChecker
