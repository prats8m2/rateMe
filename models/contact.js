const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contact = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: {
        type: Number, required: true, default: function () {
            return this.contacts.firstName + " " + this.contacts.lastName;
        }
    },
    mobile: { type: String, required: false },
    timestamp: { type: Date, required: false, default: Date.now },
    status: { type: Number, required: false, default: 0 }
});