import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { logAPI } from '../services/api'
import RangeSlider from '../components/RangeSlider'

const AddLog = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, watch, setValue } = useForm()

  const symptoms = [
    'itching',
    'flaking',
    'redness',
    'oiliness',
    'tightness',
    'tenderness',
    'hypopigmentation',
    'hairThinning',
    'dryness'
  ]

  const beaBayouProducts = [
    "Bea's Bayou Seborrheic Scalp Solution",
    "Bea's Bayou Prebiotic Scalp Oil",
    "Bea's Bayou Seborrheic Clarifying Shampoo",
    "Bea's Bayou Seborrheic Moisturizing Shampoo",
    "Bea's Bayou Seborrheic Moisturizing Conditioner",
    "Bea's Bayou Zinc & Algae Scalp Mask",
    "Bea's Bayou Seborrheic Facial Solution"
  ]

  const onSubmit = async data => {
    setIsSubmitting(true)
    try {
      const form = new FormData()

      // 1) Nested objects must be stringified for multipart/form-data
      form.append(
        'symptoms',
        JSON.stringify({
          itching: parseInt(data.itching) || 1,
          flaking: parseInt(data.flaking) || 1,
          redness: parseInt(data.redness) || 1,
          oiliness: parseInt(data.oiliness) || 1,
          tightness: parseInt(data.tightness) || 1,
          tenderness: parseInt(data.tenderness) || 1,
          hypopigmentation: parseInt(data.hypopigmentation) || 1,
          hairThinning: parseInt(data.hairThinning) || 1,
          dryness: parseInt(data.dryness) || 1
        })
      )

      form.append(
        'symptomTiming',
        JSON.stringify({
          startTime: data.startTime || '',
          endTime: data.endTime || ''
        })
      )

      form.append(
        'productsUsed',
        JSON.stringify({
          beaBayouProducts: data.beaBayouProducts || [],
          otherProducts: data.otherProducts || ''
        })
      )

      form.append(
        'haircareRoutine',
        JSON.stringify({
          hairstyle: data.hairstyle || '',
          wasWashDay: !!data.wasWashDay
        })
      )

      form.append('stressLevel', String(parseInt(data.stressLevel) || 1))

      form.append(
        'dietLifestyle',
        JSON.stringify({
          meals: data.meals || '',
          consumedAlcohol: !!data.consumedAlcohol,
          highSugarIntake: !!data.highSugarIntake
        })
      )

      form.append('personalNotes', data.personalNotes || '')

      // 2) SINGLE file only: append first file under 'scalpPhotos'
      const file = data.scalpPhotos?.[0]
      if (file) {
        form.append('scalpPhotos', file)
      }

      // 3) Send FormData (multipart/form-data)
      await logAPI.addLog(form)

      toast.success('Log entry added successfully!')
      reset()
      navigate('/dashboard')
    } catch (error) {
      console.error('Error adding log:', error)
      toast.error('Failed to add log entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className='mb-4 text-blue-600 hover:underline'
      >
        ← Back to Dashboard
      </button>

      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Add New Log Entry
        </h1>
        <p className='text-gray-600'>
          Record your daily scalp health and hair care routine
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* Symptoms */}
        <div className='card'>
          <div className='flex items-center gap-2 mb-4'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Symptom Tracker
            </h2>
            <svg
              className='w-5 h-5 text-red-500'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <p className='text-gray-600 mb-6'>
            Rate each symptom from 1 (mild) to 10 (severe)
          </p>
          <div className='space-y-6'>
            {symptoms.map(symptom => (
              <div key={symptom} className='bg-gray-50 p-4 rounded-lg'>
                <RangeSlider
                  label={symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                  value={parseInt(watch(symptom)) || 1}
                  onChange={value => setValue(symptom, value)}
                  min={1}
                  max={10}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Symptom Timing */}
        <div className='card'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Symptom Timing
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='form-label'>Start Time</label>
              <input
                type='time'
                {...register('startTime')}
                className='form-input'
              />
            </div>
            <div>
              <label className='form-label'>End Time</label>
              <input
                type='time'
                {...register('endTime')}
                className='form-input'
              />
            </div>
          </div>
        </div>

        {/* Photo Documentation (NEW) */}
        <div className='card'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Photo Documentation{' '}
            <span className='text-gray-500'>(optional)</span>
          </h2>
          <input
            type='file'
            accept='image/*'
            {...register('scalpPhotos')}
            className='form-input'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Upload or take photos of your scalp (optional)
          </p>
        </div>

        {/* Products Used */}
        <div className='card'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Products Used
          </h2>
          <div className='space-y-4'>
            <div>
              <label className='form-label'>BeaBayou Products</label>
              <div className='flex flex-col space-y-3'>
                {beaBayouProducts.map(product => (
                  <label key={product} className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      value={product}
                      {...register('beaBayouProducts')}
                      className='rounded border-gray-300 text-primary-600 focus:ring-primary-500'
                    />
                    <span className='text-sm'>{product}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className='form-label'>Other Products</label>
              <input
                type='text'
                {...register('otherProducts')}
                placeholder='List other products used'
                className='form-input'
              />
            </div>
          </div>
        </div>

        {/* Hair Care Routine */}
        <div className='card'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Hair Care Routine
          </h2>
          <div className='space-y-4'>
            <div>
              <label className='form-label'>Hairstyle</label>
              <input
                type='text'
                {...register('hairstyle')}
                placeholder='e.g., Natural, Braids, etc.'
                className='form-input'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                {...register('wasWashDay')}
                className='rounded border-gray-300 text-primary-600 focus:ring-primary-500'
              />
              <span className='text-sm'>Was today a wash day?</span>
            </div>
          </div>
        </div>

        {/* Stress Level */}
        <div className='card'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Stress Level
          </h2>
          <div>
            <RangeSlider
              label='Rate your stress level (1-10)'
              value={parseInt(watch('stressLevel')) || 1}
              onChange={value => setValue('stressLevel', value)}
              min={1}
              max={10}
            />
          </div>
        </div>

        {/* Diet & Lifestyle */}
        <div className='card'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Diet & Lifestyle
          </h2>
          <div className='space-y-4'>
            <div>
              <label className='form-label'>Meals</label>
              <textarea
                {...register('meals')}
                placeholder='Describe your meals for the day'
                className='form-input'
                rows='3'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                {...register('consumedAlcohol')}
                className='rounded border-gray-300 text-primary-600 focus:ring-primary-500'
              />
              <span className='text-sm'>Consumed alcohol today</span>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                {...register('highSugarIntake')}
                className='rounded border-gray-300 text-primary-600 focus:ring-primary-500'
              />
              <span className='text-sm'>High sugar intake today</span>
            </div>
          </div>
        </div>

        {/* Personal Notes */}
        <div className='card'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Personal Notes
          </h2>
          <div>
            <label className='form-label'>Additional Notes</label>
            <textarea
              {...register('personalNotes')}
              placeholder='Any additional observations or notes...'
              className='form-input'
              rows='4'
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={() => navigate('/dashboard')}
            className='btn-secondary'
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type='submit' className='btn-primary' disabled={isSubmitting}>
            {isSubmitting ? 'Adding Log...' : 'Add Log Entry'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddLog
