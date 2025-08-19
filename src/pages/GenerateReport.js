import React, { useState } from 'react';
import { reportAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Download, FileText, Calendar } from 'lucide-react';

const GenerateReport = () => {
  const [userId, setUserId] = useState('603dcd1f1c4ae15f8c5d1234');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!userId.trim()) {
      toast.error('Please enter a valid User ID');
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await reportAPI.generateReport(userId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hair-care-report-${userId}-${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report generated and downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please check if the user has logs for the last 30 days.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Report</h1>
        <p className="text-gray-600">
          Generate a comprehensive Word document report of the last 30 days of hair care logs
        </p>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-primary-100 rounded-lg">
            <FileText className="text-primary-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">30-Day Report</h2>
            <p className="text-sm text-gray-600">
              Creates a detailed Word document with symptom summaries, product usage, and personal notes
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* User ID Input */}
          <div>
            <label className="form-label">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="form-input"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the user ID for whom you want to generate the report
            </p>
          </div>

          {/* Report Features */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Report Includes:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-sm text-gray-600">Daily log entries with symptoms and products</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-sm text-gray-600">Symptom summary with average scores</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-sm text-gray-600">Product usage frequency analysis</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-sm text-gray-600">Personal notes with dates</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-sm text-gray-600">Stress level tracking</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-sm text-gray-600">Lifestyle and diet information</span>
              </div>
            </div>
          </div>

          {/* Date Range Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="text-blue-600" size={20} />
              <span className="font-medium text-blue-900">Report Period</span>
            </div>
            <p className="text-sm text-blue-800">
              The report will cover the last 30 days from today. If no logs are found for this period, 
              the report generation will fail.
            </p>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>1. <strong>Enter User ID:</strong> Provide the user ID for whom you want to generate the report</p>
          <p>2. <strong>Click Generate:</strong> The system will create a Word document with the last 30 days of logs</p>
          <p>3. <strong>Download:</strong> The file will automatically download to your device</p>
          <p>4. <strong>Share:</strong> You can share this report with healthcare providers or keep for personal records</p>
        </div>
      </div>

      {/* Tips */}
      <div className="card mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Make sure the user has log entries from the last 30 days</p>
          <p>• The report includes comprehensive data analysis and summaries</p>
          <p>• You can generate multiple reports for different time periods</p>
          <p>• The Word document is professionally formatted and ready to share</p>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport; 