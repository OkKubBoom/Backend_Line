const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_line: String,
    updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('UserLine', UserSchema)