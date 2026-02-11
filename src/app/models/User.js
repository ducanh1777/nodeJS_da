const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    fullname: { type: String },
    avatar: { type: String, default: 'https://files.f8.edu.vn/f8-prod/user_photos/360703/65105d07c2f4b.jpg' },
    role: { type: String, default: 'user' },
    enrolled_courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    isBlocked: { type: Boolean, default: false },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);
