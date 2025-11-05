const express = require('express');
const { createAgent, getAgents, updateAgent, deleteAgent } = require('../controllers/agentController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.post('/', createAgent);
router.get('/', getAgents);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router;