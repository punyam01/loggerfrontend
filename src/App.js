import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AddLog from './pages/AddLog'
import GenerateReport from './pages/GenerateReport'
import { authAPI } from './services/api'
import SetReminder from './pages/SetReminder'
import './App.css'

// Create Auth Context
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    // On mount, fetch user from cookie-based session
    const checkAuth = async () => {
      setLoading(true)
      try {
        const response = await authAPI.getMe()
        setUser(response.data.data || response.data.user || response.data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = (_token, userData = null) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    setUser,
    isAuthenticated,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Private Route Logic
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return isAuthenticated ? children : <Navigate to='/login' replace />
}

export default function App () {
  return (
    <AuthProvider>
      <Router>
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <main className='container mx-auto px-4 py-8'>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />

              <Route
                path='/dashboard'
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path='/add-log'
                element={
                  <PrivateRoute>
                    <AddLog />
                  </PrivateRoute>
                }
              />
              <Route
                path='/setreminder'
                element={
                  <PrivateRoute>
                    <SetReminder />
                  </PrivateRoute>
                }
              />
              <Route
                path='/generate-report'
                element={
                  <PrivateRoute>
                    <GenerateReport />
                  </PrivateRoute>
                }
              />

              {/* Default Route */}
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
            </Routes>
          </main>
          <Toaster position='top-right' />
        </div>
      </Router>
    </AuthProvider>
  )
}
