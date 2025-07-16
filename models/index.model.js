const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        required:true,
        type:String
    },
    token: {
        type: String
    },
    favoriteMovies: Array
});

const User = mongoose.models.User || mongoose.model('User', UserSchema)

module.exports = { User }
