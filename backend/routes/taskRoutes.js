
const express = require('express');
const { getMyTasks,updateTask } = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(authMiddleware);
router.get('/my-tasks', authMiddleware, getMyTasks);
router.put('/:id', updateTask);


module.exports = router;