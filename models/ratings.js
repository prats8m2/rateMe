const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ratings = new Schema({
            uid: { type: String, required: true }, // user ID who is giving the rating
            fid: { type: String, required: true }, // user ID for whom the rating is given
            rating1: { type: Number, required: false },
            rating2: { type: Number, required: false },
            rating3: { type: Number, required: false },
            rating4: { type: Number, required: false },
            rating5: { type: Number, required: false },
            timestamp: { type: Date, required: false, default: Date.now },
            privacy: { type: Boolean, required: true, default: true },
            status: { type: Number, required: false, default: 1 },
            commentCount: {
                type: Number, required: false, default: function () {
                    return this.comments.length;
                }
            }, comments: [{
                comment: { type: String, required: true },
                timestamp: { type: Date, required: false, default: Date.now },
                status: { type: Number, required: false, default: 1 },
            }]
});

module.exports = mongoose.model('Ratings', Ratings);
