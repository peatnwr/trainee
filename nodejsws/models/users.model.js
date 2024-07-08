const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    name: { type: String, unique: true },
    is_admin: { type: Boolean },
    is_approve: { type: Boolean }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);