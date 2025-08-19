import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '../App'

const Signup = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!form.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!validateForm()) return
    setLoading(true)
    try {
      const { confirmPassword, ...signupData } = form
      await authAPI.register(signupData)
      const userResponse = await authAPI.getMe()
      login(null, userResponse.data.data || userResponse.data)
      toast.success('Registration successful! Welcome!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Signup error:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto p-4 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-4'>Join HairCare</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-1' htmlFor='name'>
            Name
          </label>
          <input
            type='text'
            name='name'
            id='name'
            placeholder='Your name'
            value={form.name}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1' htmlFor='email'>
            Email
          </label>
          <input
            type='email'
            name='email'
            id='email'
            placeholder='you@example.com'
            value={form.email}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1' htmlFor='password'>
            Password
          </label>
          <input
            type='password'
            name='password'
            id='password'
            placeholder='Your password'
            value={form.password}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border rounded'
            minLength={6}
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1' htmlFor='confirmPassword'>
            Confirm Password
          </label>
          <input
            type='password'
            name='confirmPassword'
            id='confirmPassword'
            placeholder='Confirm your password'
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border rounded'
            minLength={6}
          />
        </div>
        {error && (
          <p className='mb-2 text-red-600 font-semibold' role='alert'>
            {error}
          </p>
        )}
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className='mt-4 text-center'>
        Already have an account?{' '}
        <a href='/login' className='text-blue-600 underline'>
          Login
        </a>
      </p>
    </div>
  )
}

export default Signup
