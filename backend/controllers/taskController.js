const Agent = require("../models/Agent");
const Task = require("../models/Task");

const getMyTasks = async (req, res) => {
  try {
    console.log('=== GET MY TASKS START ===');
    console.log('User making request:', {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    });

    // Find the agent by email (since agent and user have same email)
    const agent = await Agent.findOne({ email: req.user.email });
    
    console.log('Agent found in database:', agent);

    if (!agent) {
      console.log('NO AGENT FOUND for email:', req.user.email);
      return res.status(404).json({ message: 'Agent profile not found. Please contact administrator.' });
    }

    console.log('Searching for tasks with agent ID:', agent._id);
    
    const tasks = await Task.find({ agent: agent._id })
      .populate('list', 'originalName')
      .sort({ assignedAt: -1 });

    console.log('Tasks found in database:', tasks.length);
    console.log('Tasks details:', tasks);

    res.json(tasks);
    
    console.log('=== GET MY TASKS COMPLETE ===');
  } catch (error) {
    console.error('=== GET MY TASKS ERROR ===');
    console.error('Error details:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('agent', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};
module.exports = { getMyTasks ,updateTask};