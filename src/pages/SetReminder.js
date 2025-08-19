import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { userAPI } from '../services/api'
import TimePicker from 'react-time-picker'
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'

const SetReminder = () => {
  const [reminderTime, setReminderTime] = useState('')
  const [emailReminder, setEmailReminder] = useState(true) // ✅ default true
  const [loading, setLoading] = useState(false)
  const [nextReminder, setNextReminder] = useState(null)
  const [confirmedTime, setConfirmedTime] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!reminderTime) {
      toast.error('Please select a reminder time')
      return
    }
    setLoading(true)
    try {
      const response = await userAPI.setReminder({
        reminderTime,
        emailReminder
      })
      if (response.data.success) {
        toast.success('Reminder set successfully!')
        setNextReminder(response.data.data.nextReminder)
        setConfirmedTime(response.data.data.reminderTime || reminderTime)
        setEmailReminder(response.data.data.emailReminder) // update from backend response
      } else {
        toast.error(response.data.message || 'Failed to set reminder')
      }
    } catch (error) {
      console.error('Error setting reminder:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Utility: Convert "19:00" to "07:00 PM"
  const toAMPM = time24 => {
    if (!time24) return ''
    const [hour, minute] = time24.split(':').map(Number)
    const date = new Date()
    date.setHours(hour)
    date.setMinutes(minute)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const presets = ['09:00', '12:00', '16:00', '18:00']

  return (
    <div className='max-w-md mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl'>
      <h1 className='text-3xl font-extrabold mb-8 text-left'>
        Set Daily Reminder
      </h1>
      {confirmedTime && (
        <div className='mb-6 p-4 bg-blue-100 text-blue-900 rounded-lg border-l-4 border-blue-400 shadow'>
          <b>Reminder set for:</b>{' '}
          <span className='font-bold'>{toAMPM(confirmedTime)}</span>
          <br />
          <span className='text-sm'>
            Email Reminder: {emailReminder ? 'On' : 'Off'}
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='flex flex-col items-start'>
          <label className='form-label text-lg font-semibold mb-2'>
            Reminder Time
          </label>
          <TimePicker
            onChange={setReminderTime}
            value={reminderTime}
            format='h:mm a'
            clearIcon={null}
            clockIcon={null}
            className='w-full text-3xl px-4 py-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-800 transition-all shadow-lg'
            disableClock={true}
            amPmAriaLabel='Select AM/PM'
            hourPlaceholder='hh'
            minutePlaceholder='mm'
          />
          <div className='flex gap-3 mt-6'>
            {presets.map(tp => (
              <button
                type='button'
                key={tp}
                className='bg-blue-600 text-white text-lg rounded-lg px-5 py-2 font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all'
                onClick={() => setReminderTime(tp)}
              >
                {toAMPM(tp)}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Email reminder toggle */}
        <div className='flex items-center gap-3'>
          <input
            type='checkbox'
            id='emailReminder'
            checked={emailReminder}
            onChange={e => setEmailReminder(e.target.checked)}
            className='w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <label htmlFor='emailReminder' className='text-lg font-medium'>
            Receive Email Reminders
          </label>
        </div>

        <div className='flex justify-between mt-8'>
          <button
            type='button'
            onClick={() => navigate('/dashboard')}
            className='btn-secondary text-lg px-6 py-2'
          >
            Back
          </button>
          <button
            type='submit'
            className='btn-primary text-lg px-6 py-2'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Reminder'}
          </button>
        </div>
      </form>
      {nextReminder && (
        <div className='mt-10 p-5 bg-green-50 border border-green-200 rounded-lg'>
          <p className='text-green-700 font-bold'>Next reminder scheduled:</p>
          <p className='text-gray-800 text-lg'>
            {new Date(nextReminder).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}

export default SetReminder
