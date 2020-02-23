const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contact = new Schema({
    fullName: { type: String, required: true },
    mobile: { type: String, required: false },
    timestamp: { type: Date, required: false, default: Date.now },
    status: { type: Number, required: false, default: 0 }
});

module.exports = mongoose.model('Contact', Contact);
