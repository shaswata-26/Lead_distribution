import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DistributionView from './DistributionView';
import api from '../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const data = await api.get('/lists');
      setLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchLists();
    setActiveTab('distribution');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload CSV
            </button>
            <button
              onClick={() => {
                setActiveTab('distribution');
                fetchLists();
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'distribution'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              View Distribution
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'upload' && (
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          )}
          
          {activeTab === 'distribution' && (
            <DistributionView 
              lists={lists} 
              loading={loading}
              onRefresh={fetchLists}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;