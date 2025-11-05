const express = require('express');
const { uploadList, getLists, getListDistribution } = require('../controllers/listController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.post('/upload', upload.single('file'), uploadList);
router.get('/', getLists);
router.get('/:id', getListDistribution);

module.exports = router;