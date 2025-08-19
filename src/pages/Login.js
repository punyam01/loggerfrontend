import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '../App'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authAPI.login(form)
      // After login, fetch current user details:
      const userResponse = await authAPI.getMe()
      login(null, userResponse.data.data || userResponse.data)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto p-4 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-4'>Login to HairCare</h2>
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className='mt-4 text-center'>
        Don't have an account?{' '}
        <a href='/signup' className='text-blue-600 underline'>
          Sign up
        </a>
      </p>
    </div>
  )
}

export default Login
