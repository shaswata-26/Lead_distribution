import React from 'react';
import AgentTaskItem from './AgentTaskItem';

const AgentTaskList = ({ tasks, loading, onTaskUpdate }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          My Assigned Tasks ({tasks.length})
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Manage your assigned customer contacts
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks assigned to you yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Contact your administrator for new assignments.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <AgentTaskItem 
                key={task._id} 
                task={task} 
                onUpdate={onTaskUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentTaskList;