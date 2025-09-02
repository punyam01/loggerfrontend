import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { useAuth } from '../../App'
import { toast } from 'react-hot-toast'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, setUser, isAuthenticated, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && !user) {
        setLoading(true)
        try {
          const response = await authAPI.getMe()
          setUser(response.data?.user || response.data?.data || response.data)
        } catch (error) {
          console.error('Failed to fetch user:', error)
          toast.error('Session expired. Please login again.')
          handleLocalLogout()
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUser()
  }, [isAuthenticated, user, setUser])

  const handleLocalLogout = () => {
    try {
      localStorage.removeItem('accessToken')
    } catch {}
    logout()
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.success('Logged out')
    } finally {
      handleLocalLogout()
      navigate('/login')
      setIsDropdownOpen(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false)
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <nav className='bg-white shadow-lg border-b'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className='text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors'
          >
            HairCare Log
          </Link>

          {/* Right Side */}
          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <>
                {/* User Dropdown */}
                <div className='relative'>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setIsDropdownOpen(!isDropdownOpen)
                    }}
                    className='flex items-center space-x-2 text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors'
                  >
                    <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium'>
                      {loading ? (
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                      ) : (
                        (user?.name || user?.email || 'U')
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50'>
                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Not authenticated - show login/signup */
              <div className='flex items-center space-x-4'>
                <Link
                  to='/login'
                  className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
                >
                  Sign In
                </Link>
                <Link
                  to='/signup'
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
