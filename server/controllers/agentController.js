const asyncHandler = require('express-async-handler');
const Agent = require('../models/Agent');
const Record = require('../models/Record');


const getAgents = asyncHandler(async (req, res) => {
    const agents = await Agent.find({}).select('-password');
    res.json(agents);
});


const createAgent = asyncHandler(async (req, res) => {
    const { name, email, mobile, password } = req.body;

    const agentExists = await Agent.findOne({ email });

    if (agentExists) {
        res.status(400);
        throw new Error('Agent with this email already exists');
    }

    if (!/^\d{10}$/.test(mobile)) {
        res.status(400);
        throw new Error('Mobile number must be exactly 10 digits');
    }

    const mobileExists = await Agent.findOne({ mobile });

    if (mobileExists) {
        res.status(400);
        throw new Error('Agent with this mobile number already exists');
    }

    const agent = await Agent.create({
        name,
        email,
        mobile,
        password,
    });

    if (agent) {
        res.status(201).json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            mobile: agent.mobile,
        });
    } else {
        res.status(400);
        throw new Error('Invalid agent data');
    }
});


const updateAgent = asyncHandler(async (req, res) => {
    const agent = await Agent.findById(req.params.id);

    if (agent) {
        agent.name = req.body.name || agent.name;
        agent.email = req.body.email || agent.email;
        agent.mobile = req.body.mobile || agent.mobile;
        if (req.body.password) {
            agent.password = req.body.password;
        }

        const updatedAgent = await agent.save();

        res.json({
            _id: updatedAgent._id,
            name: updatedAgent.name,
            email: updatedAgent.email,
            mobile: updatedAgent.mobile,
        });
    } else {
        res.status(404);
        throw new Error('Agent not found');
    }
});


const deleteAgent = asyncHandler(async (req, res) => {
    const agent = await Agent.findById(req.params.id);

    if (agent) {
        await Agent.deleteOne({ _id: req.params.id });
        res.json({ message: 'Agent removed' });
    } else {
        res.status(404);
        throw new Error('Agent not found');
    }
});


const getDashboardStats = asyncHandler(async (req, res) => {
    const totalAgents = await Agent.countDocuments();
    const totalRecords = await Record.countDocuments();
    res.json({ totalAgents, totalRecords });
});


const getAgentRecords = asyncHandler(async (req, res) => {
    const records = await Record.find({ assignedTo: req.params.id });
    res.json(records);
});


const getAgentById = asyncHandler(async (req, res) => {
    const agent = await Agent.findById(req.params.id).select('-password');
    if (agent) {
        res.json(agent);
    } else {
        res.status(404);
        throw new Error('Agent not found');
    }
});

module.exports = {
    getAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
    getDashboardStats,
    getAgentRecords,
};
