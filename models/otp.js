const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTP = new Schema({
    mobile: { type: String, unique : true, required: true },
    otp: { type: Number, required: true},
    status: { type: Number, required: false, default: 0 }
});

module.exports = mongoose.model('OTP', OTP);

/*
________________________________________________________
STATUS
0: OTP sent not verified
1: OTP verified
*/
