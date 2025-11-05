import React, { useState } from 'react';
import api from '../services/api';

const AgentTaskItem = ({ task, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState({
    status: task.status,
    outcome: task.outcome || '',
    agentNotes: task.agentNotes || '',
    callDuration: task.callDuration || 0
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await api.put(`/tasks/${task._id}`, {
        ...formData,
        ...(formData.status === 'completed' && { completedAt: new Date() }),
        ...(formData.status === 'in-progress' && !task.startedAt && { startedAt: new Date() })
      });
      setShowUpdateForm(false);
      onUpdate(); // Refresh the task list
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Task Info */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{task.firstName}</h4>
          <p className="text-sm text-gray-600">{task.phone}</p>
          <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            {showUpdateForm ? 'Cancel' : 'Update'}
          </button>
        </div>
      </div>

      {/* Update Form */}
      {showUpdateForm && (
        <form onSubmit={handleUpdate} className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Outcome</label>
              <select
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select outcome</option>
                <option value="success">Success</option>
                <option value="no-answer">No Answer</option>
                <option value="callback">Callback Requested</option>
                <option value="not-interested">Not Interested</option>
                <option value="wrong-number">Wrong Number</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.agentNotes}
                onChange={(e) => setFormData({ ...formData, agentNotes: e.target.value })}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Add your notes about this contact..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Call Duration (seconds)</label>
              <input
                type="number"
                value={formData.callDuration}
                onChange={(e) => setFormData({ ...formData, callDuration: parseInt(e.target.value) || 0 })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      )}

      {/* Task Metadata */}
      <div className="text-xs text-gray-500 mt-2">
        Assigned: {new Date(task.assignedAt).toLocaleDateString()}
        {task.completedAt && ` • Completed: ${new Date(task.completedAt).toLocaleDateString()}`}
        {task.callDuration > 0 && ` • Duration: ${task.callDuration}s`}
      </div>
    </div>
  );
};

export default AgentTaskItem;