const mongoose = require('mongoose');
const Schema 		= mongoose.Schema;

const Sms = new Schema({
				count: { type: Number, required: true, default: 1 },
				uid: { type: String, required: true }
});

module.exports = mongoose.model('Sms', Sms);