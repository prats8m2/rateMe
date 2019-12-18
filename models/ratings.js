const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ratings = new Schema({
            id: { type: String, required: true },
            name: { type: String, required: true },
            mobile: { type: String, required: true },
            rating1: { type: Number, required: false },
            rating2: { type: Number, required: false },
            rating3: { type: Number, required: false },
            rating4: { type: Number, required: false },
            rating5: { type: Number, required: false },
            timestamp: { type: Date, required: false, default: Date.now },
            public: { type: Boolean, required: true, default: true },
            status: { type: Number, required: false, default: 1 },
            commentCount: {
                type: Number, required: false, default: function () {
                    return this.ratings.comments.length;
                }
            }, comments: [{
                name: { type: String, required: true },
                comment: { type: String, required: true },
                timestamp: { type: Date, required: false, default: Date.now },
                status: { type: Number, required: false, default: 1 },
            }]
});

module.exports = mongoose.model('Ratings', Ratings);
