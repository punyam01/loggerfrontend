import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1`,
  withCredentials: true,
  timeout: 10000 // 10 seconds
})

// Request interceptor to add token if present - Optional if using cookie-based auth
api.interceptors.request.use(
  config => {
    // No token needed if backend uses cookie auth
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor to handle unauthorized errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Possibly handle global logout here
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: data => api.post('/auth/login', data),
  register: data => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
}

export const logAPI = {
  addLog: data => api.post('/log/add', data), // matches POST /logs/add
  getCurrentMonthCount: () => api.get('/log/monthlycount'), // matches GET /logs/monthlycount
  getSymptomTrend: () => api.get('/log/symptomtrend'), // matches GET /logs/symptomtrend
  getLastLogInfo: () => api.get('/log/lastloginfo') // matches GET /logs/lastloginfo
}

export const userAPI = {
  setReminder: reminderData => api.put('/user/setreminder', reminderData)
}

export const reportAPI = {
  generate: userId => {
    // If userId is provided, add as query parameter
    const config = { responseType: 'blob' }
    if (userId) {
      config.params = { userId }
    }
    return api.get('/reports/generate', config)
  },
  getAll: () => api.get('/report'),
  getById: id => api.get(`/report/${id}`)
}
