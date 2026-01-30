const express = require('express');
const router = express.Router();
const {
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    getDashboardStats,
    getAgentRecords,
    getAgentById
} = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.route('/').get(protect, getAgents).post(protect, createAgent);
router.route('/:id').get(protect, getAgentById).put(protect, updateAgent).delete(protect, deleteAgent);
router.get('/:id/records', protect, getAgentRecords);

module.exports = router;
