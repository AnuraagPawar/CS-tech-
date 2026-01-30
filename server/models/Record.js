const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    }
}, {
    timestamps: true
});

const Record = mongoose.model('Record', recordSchema);
module.exports = Record;
