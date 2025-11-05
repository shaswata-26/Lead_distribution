import React from 'react';

const DistributionView = ({ lists, loading, onRefresh }) => {
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
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            List Distribution
          </h3>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
          >
            Refresh
          </button>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View how lists are distributed among agents
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {lists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No lists uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {lists.map((list) => (
              <div key={list._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      {list.originalName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Uploaded on {new Date(list.createdAt).toLocaleDateString()} • 
                      Total Records: {list.totalRecords}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    list.status === 'distributed' 
                      ? 'bg-green-100 text-green-800'
                      : list.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {list.status}
                  </span>
                </div>

                {list.distribution && list.distribution.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Distribution:
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {list.distribution.map((dist, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {dist.agent?.name || `Agent ${index + 1}`}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {dist.count} records
                            </span>
                          </div>
                          {dist.agent?.email && (
                            <p className="text-xs text-gray-500 mt-1">
                              {dist.agent.email}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionView;