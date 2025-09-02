import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1`,
  withCredentials: true,
  timeout: 10000 // 10 seconds
})

// Request interceptor to add token if present (fallback for browsers blocking 3rd-party cookies)
api.interceptors.request.use(
  config => {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      // ignore storage errors
    }
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
  addLog: data => api.post('/logs/add', data),
  getCurrentMonthCount: () => api.get('/logs/monthlycount'),
  getSymptomTrend: () => api.get('/logs/symptomtrend'),
  getLastLogInfo: () => api.get('/logs/lastloginfo')
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
  getById: id => api.get(`/report/${id}`),
  mailReport: email => api.post('/reports/mailreport', { email })
}
