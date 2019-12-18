const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    mobile: { type: String, unique : true, required: true },
    fullName: { type: String, required: true},
    email: { type: String, required: false},
    password: { type: String, required: true},
    gender: { type: String, required: true },
    role: { type: Number, required: true, default: 1 },
    overallRating: { type: Number, required: false },
    ratingCount: {
        type: Number, required: false, default: function () {
            return this.ratings ? this.ratings.length : 0;
        }
    },
    created: { type: String, required: true },
    updated: { type: Date, required: true, default: Date.now },
    rating1: { type: Number, required: false },
    rating2: { type: Number, required: false },
    rating3: { type: Number, required: false },
    rating4: { type: Number, required: false },
    rating5: { type: Number, required: false },
    status: { type: Number, required: false, default: 1 },
    ratings: [],
    contacts: [],
    isRegistered: { type: Number, required: false, default: 1 },
    settings:{
            notification: { type: Number, required: true, default: 1 }
        }
});

module.exports = mongoose.model('User', User);

/*
________________________________________________________
ROLE
1: User
2: Admin
________________________________________________________
STATUS
0: Registered not rated
1: Registered & rated
2: Account on hold
3: Account deleted
_________________________________________________________
NOTIFICATION
1: Open for all notification
2: Close for all notification
3: Less notification
*/
