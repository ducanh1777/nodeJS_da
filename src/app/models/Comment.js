const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
    content: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    news_id: { type: Schema.Types.ObjectId, ref: 'News', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Comment', Comment);
