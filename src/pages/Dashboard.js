import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Calendar,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  FileText,
  Share2,
  Download
} from 'lucide-react'
import SymptomChart from '../components/SymptomChart'
import { logAPI, reportAPI } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    lastEntry: null,
    totalEntries: 0,
    avgWellness: 0,
    recentSymptoms: [],
    symptomData: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      let totalEntriesRes, lastEntryRes, symptomTrendRes

      try {
        totalEntriesRes = await logAPI.getCurrentMonthCount()
      } catch {
        totalEntriesRes = { data: { data: { logCount: 0, month: '' } } }
      }

      try {
        lastEntryRes = await logAPI.getLastLogInfo()
      } catch {
        lastEntryRes = { data: { data: null } }
      }

      try {
        symptomTrendRes = await logAPI.getSymptomTrend()
      } catch {
        symptomTrendRes = { data: { data: [] } }
      }

      // Your exact existing logic unchanged
      const trendData = symptomTrendRes.data.data || []

      let avgWellness = 0
      if (trendData.length > 0) {
        const sum = trendData.reduce(
          (acc, s) => acc + (parseFloat(s.averageSymptomScore) || 0),
          0
        )
        avgWellness = parseFloat((sum / trendData.length).toFixed(1))
      }

      const recentSymptoms = trendData.map(s => ({
        name: new Date(s.date).toLocaleDateString(),
        average: parseFloat(s.averageSymptomScore) || 0,
        trend: 'stable'
      }))

      setDashboardData({
        lastEntry: lastEntryRes.data.data || null,
        totalEntries: totalEntriesRes.data.data.logCount || 0,
        totalMonth: totalEntriesRes.data.data.month || '',
        avgWellness,
        recentSymptoms,
        symptomData: trendData
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = dateString => {
    if (!dateString) return 'No entries'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysAgo = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  const [reportDownloading, setReportDownloading] = useState(false)

  const handleReportDownload = async () => {
    setReportDownloading(true)
    try {
      const res = await reportAPI.generate() // responseType: 'blob'
      const blob = new Blob([res.data], {
        type:
          res.headers['content-type'] ||
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })

      // 1) Peek at blob to see if it's JSON error (e.g., 400 no logs)
      const textPreview = await blob.slice(0, 1024).text()
      try {
        const maybeJson = JSON.parse(textPreview)
        if (maybeJson && maybeJson.success === false) {
          toast.error(
            maybeJson.message ||
              'Please add a log before generating the report.'
          )
          setReportDownloading(false)
          return
        }
      } catch {
        // Not JSON, proceed with download
      }

      // 2) Download valid DOCX
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `hair-care-report-${
        new Date().toISOString().split('T')[0]
      }.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Report generated and downloaded successfully!')
    } catch (err) {
      // If backend returned 4xx/5xx, Axios throws; the body is still a blob (because responseType: 'blob')
      if (err?.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text()
          const json = JSON.parse(text)
          if (json && json.success === false) {
            toast.error(
              json.message || 'Please add a log before generating the report.'
            )
            setReportDownloading(false)
            return
          }
        } catch {
          // Fallthrough to generic message
        }
      }
      console.error('Error generating report:', err)
      toast.error('Failed to generate report. Please try again.')
    } finally {
      setReportDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className='max-w-6xl mx-auto p-6'>
        <div className='text-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Your ScalpBiomeCheck Dashboard
          </h1>
          <p className='text-gray-600'>Track your scalp health journey</p>
        </div>
        <button className='p-2 text-gray-500 hover:text-gray-700'>
          <Settings size={20} />
        </button>
      </div>

      {/* Main Action Buttons */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Link to='/add-log' className='block'>
          <div className='bg-green-700 p-6 rounded-lg text-white hover:bg-green-800 transition-colors'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-white bg-opacity-20 rounded-lg'>
                <Plus size={24} />
              </div>
              <div>
                <h3 className='text-xl font-bold'>Log New Entry</h3>
                <p className='text-green-100'>Track today's symptoms</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to='/setreminder' className='block'>
          <div className='bg-purple-500 p-6 rounded-lg text-white hover:bg-purple-600 transition-colors cursor-pointer'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-white bg-opacity-20 rounded-lg'>
                <Calendar size={24} />
              </div>
              <div>
                <h3 className='text-xl font-bold'>Set Reminder</h3>
                <p className='text-purple-100'>Daily check-in alerts</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Key Metrics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
          <h3 className='text-green-600 font-semibold text-sm mb-2'>
            Last Entry
          </h3>
          <div className='text-3xl font-bold text-gray-900 mb-1'>
            {dashboardData.lastEntry
              ? formatDate(dashboardData.lastEntry.lastLogDate)
              : 'No entries'}
          </div>
          <p className='text-gray-500 text-sm'>
            {dashboardData.lastEntry
              ? getDaysAgo(dashboardData.lastEntry.lastLogDate)
              : 'Start logging'}
          </p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
          <h3 className='text-green-600 font-semibold text-sm mb-2'>
            Total Entries
          </h3>
          <div className='text-3xl font-bold text-gray-900 mb-1'>
            {dashboardData.totalEntries}
          </div>
          <p className='text-gray-500 text-sm'>This month</p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
          <h3 className='text-green-600 font-semibold text-sm mb-2'>
            Avg. Wellness
          </h3>
          <div className='flex items-center space-x-2'>
            <div className='text-3xl font-bold text-gray-900'>
              {dashboardData.avgWellness}
            </div>
            <div className='flex items-center text-green-600 text-sm'>
              <TrendingUp size={16} />
              <span className='ml-1'>Improving</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Symptom Trends */}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
        <div className='flex items-center space-x-2 mb-4'>
          <BarChart3 size={20} className='text-gray-700' />
          <h2 className='text-xl font-bold text-gray-900'>
            Recent Symptom Trends
          </h2>
        </div>
        <p className='text-gray-600 mb-6'>
          Your most tracked symptoms from the past week
        </p>

        <div className='space-y-4'>
          {dashboardData.recentSymptoms.slice(0, 4).map(symptom => (
            <div
              key={symptom.name}
              className='flex items-center justify-between'
            >
              <span className='text-gray-900 font-medium capitalize'>
                {symptom.name}
              </span>
              <div className='flex items-center space-x-3'>
                <span className='bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium'>
                  Level {symptom.average}
                </span>
                <div className='flex items-center text-green-600 text-sm'>
                  <TrendingDown size={16} />
                  <span className='ml-1'>Improving</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Symptom Timeline */}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
        <div className='flex items-center space-x-2 mb-4'>
          <BarChart3 size={20} className='text-green-700' />
          <h2 className='text-xl font-bold text-gray-900'>Symptom Timeline</h2>
        </div>
        <p className='text-gray-600 mb-6'>
          Visualize your symptoms over the past 30 days
        </p>

        <SymptomChart symptoms={dashboardData.symptomData} />
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <button
          onClick={handleReportDownload}
          className='block w-full text-left'
        >
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='flex items-center space-x-4'>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <FileText className='text-blue-600' size={24} />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>Download Report</h3>
                <p className='text-sm text-gray-600'>Check your past entries</p>
              </div>
            </div>
          </div>
        </button>

        <Link to='/generate-report' className='block'>
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='flex items-center space-x-4'>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <Share2 className='text-purple-600' size={24} />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>Mail Report</h3>
                <p className='text-sm text-gray-600'>
                  Create comprehensive reports
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
