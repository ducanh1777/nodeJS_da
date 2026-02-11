const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const News = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    image: { type: String },
    slug: { type: String, slug: 'title', unique: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});

// Add plugins
mongoose.plugin(slug);
News.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('News', News);
