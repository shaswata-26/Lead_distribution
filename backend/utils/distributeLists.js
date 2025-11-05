const Agent = require('../models/Agent');
const Task = require('../models/Task');

const distributeLists = async (listData, listId, uploadedBy) => {
  try {
    // Get only AGENTS (not admins) who are active
    const agents = await Agent.find({ isActive: true });
    
    if (agents.length === 0) {
      throw new Error('No active agents found for distribution');
    }

    const totalItems = listData.length;
    const itemsPerAgent = Math.floor(totalItems / agents.length);
    let remainder = totalItems % agents.length;

    let distribution = [];
    let currentIndex = 0;

    // Distribute tasks among AGENTS only (not admins)
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      const itemsForThisAgent = itemsPerAgent + (remainder > 0 ? 1 : 0);
      
      if (remainder > 0) remainder--;

      const agentTasks = listData.slice(currentIndex, currentIndex + itemsForThisAgent);
      
      // Create tasks for this agent
      const tasks = agentTasks.map(item => ({
        list: listId,
        agent: agent._id,
        firstName: item.FirstName || item.firstName,
        phone: item.Phone || item.phone,
        notes: item.Notes || item.notes,
        assignedAt: new Date()
      }));

      const createdTasks = await Task.insertMany(tasks);
      
      // Update agent's assigned tasks
      await Agent.findByIdAndUpdate(agent._id, {
        $push: { assignedTasks: { $each: createdTasks.map(task => task._id) } }
      });

      distribution.push({
        agent: agent._id,
        count: itemsForThisAgent,
        tasks: createdTasks.map(task => task._id)
      });

      currentIndex += itemsForThisAgent;
    }

    return distribution;
  } catch (error) {
    throw error;
  }
};

module.exports = distributeLists;