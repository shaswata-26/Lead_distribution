import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AgentForm from '../components/AgentForm';
import AgentList from '../components/AgentList';
import api from '../services/api';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await api.get('/agents');
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAgentAdded = () => {
    fetchAgents();
    setEditingAgent(null);
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
  };

  const handleCancelEdit = () => {
    setEditingAgent(null);
  };

  const handleDelete = async (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await api.delete(`/agents/${agentId}`);
        fetchAgents();
      } catch (error) {
        console.error('Error deleting agent:', error);
        alert('Error deleting agent');
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <AgentForm 
            onAgentAdded={handleAgentAdded}
            editingAgent={editingAgent}
            onCancelEdit={handleCancelEdit}
          />
          <AgentList 
            agents={agents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;