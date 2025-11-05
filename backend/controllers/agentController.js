const Agent = require('../models/Agent');

const createAgent = async (req, res) => {
  try {
    const { name, email, mobile, countryCode, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    const agent = new Agent({
      name,
      email,
      mobile,
      countryCode,
      password
    });

    await agent.save();

    res.status(201).json({
      message: 'Agent created successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        countryCode: agent.countryCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating agent', error: error.message });
  }
};

const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password').populate('assignedTasks');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents', error: error.message });
  }
};

const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const agent = await Agent.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({ message: 'Agent updated successfully', agent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating agent', error: error.message });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findByIdAndDelete(id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting agent', error: error.message });
  }
};

module.exports = { createAgent, getAgents, updateAgent, deleteAgent };