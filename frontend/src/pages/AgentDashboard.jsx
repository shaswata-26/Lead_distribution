import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

const AgentDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAgentTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.get('/tasks/my-tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentTasks();
  }, []);

  const updateTaskStatus = async (taskId, updates) => {
    try {
      await api.put(`/tasks/${taskId}`, updates);
      fetchAgentTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const updates = { status: newStatus };
    
    if (newStatus === 'in-progress') {
      updates.startedAt = new Date();
    } else if (newStatus === 'completed') {
      updates.completedAt = new Date();
    }
    
    await updateTaskStatus(taskId, updates);
  };

  const handleOutcomeChange = async (taskId, outcome, agentNotes = '', callDuration = 0) => {
    const updates = { 
      outcome,
      agentNotes,
      callDuration: parseInt(callDuration) || 0
    };
    
    await updateTaskStatus(taskId, updates);
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Tasks</h3>
              <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {tasks.filter(task => task.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">In Progress</h3>
              <p className="text-2xl font-bold text-orange-600">
                {tasks.filter(task => task.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter(task => task.status === 'completed').length}
              </p>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                My Assigned Tasks ({tasks.length})
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Update status and add notes for each task
              </p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="loading-spinner"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  {error}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tasks assigned to you yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {tasks.map((task) => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      onStatusChange={handleStatusChange}
                      onOutcomeChange={handleOutcomeChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate TaskCard component for better organization
const TaskCard = ({ task, onStatusChange, onOutcomeChange }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [agentNotes, setAgentNotes] = useState(task.agentNotes || '');
  const [callDuration, setCallDuration] = useState(task.callDuration || '');
  const [outcome, setOutcome] = useState(task.outcome || '');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'no-answer': return 'bg-red-100 text-red-800';
      case 'callback': return 'bg-orange-100 text-orange-800';
      case 'not-interested': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveOutcome = () => {
    onOutcomeChange(task._id, outcome, agentNotes, callDuration);
    setShowDetails(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Basic Task Info */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-lg">{task.firstName}</h4>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-semibold">Phone:</span> {task.phone}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold">Notes:</span> {task.notes}
          </p>
          
          {/* Task Metadata */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            {task.outcome && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOutcomeColor(task.outcome)}`}>
                {task.outcome}
              </span>
            )}
            {task.callDuration > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Duration: {task.callDuration}s
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          {/* Quick Status Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusChange(task._id, 'in-progress')}
              disabled={task.status === 'in-progress'}
              className={`px-3 py-1 text-xs font-medium rounded ${
                task.status === 'in-progress' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Start
            </button>
            <button
              onClick={() => onStatusChange(task._id, 'completed')}
              disabled={task.status === 'completed'}
              className={`px-3 py-1 text-xs font-medium rounded ${
                task.status === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Complete
            </button>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            {showDetails ? 'Hide Details' : 'Add Details'}
          </button>
        </div>
      </div>

      {/* Detailed Update Form */}
      {showDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <h5 className="font-medium text-gray-900 mb-3">Update Task Details</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outcome Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outcome
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select outcome</option>
                <option value="success">Success</option>
                <option value="no-answer">No Answer</option>
                <option value="callback">Callback Requested</option>
                <option value="not-interested">Not Interested</option>
                <option value="wrong-number">Wrong Number</option>
              </select>
            </div>

            {/* Call Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call Duration (seconds)
              </label>
              <input
                type="number"
                value={callDuration}
                onChange={(e) => setCallDuration(e.target.value)}
                placeholder="e.g., 180"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Agent Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={agentNotes}
                onChange={(e) => setAgentNotes(e.target.value)}
                rows="3"
                placeholder="Add notes about your conversation..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveOutcome}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Details
            </button>
          </div>
        </div>
      )}

      {/* Task Timeline */}
      <div className="text-xs text-gray-500 mt-3 flex space-x-4">
        <span>Assigned: {new Date(task.assignedAt).toLocaleDateString()}</span>
        {task.startedAt && (
          <span>Started: {new Date(task.startedAt).toLocaleDateString()}</span>
        )}
        {task.completedAt && (
          <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;