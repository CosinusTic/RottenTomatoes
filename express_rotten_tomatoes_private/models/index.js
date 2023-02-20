const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
    }, 
    email: {
        type: String, 
        required: true,
    }, 
    password: {
        type: String, 
        required: true
    }, 
    access_token: {
        type: String
    }, 
    favourites: {
        type: Array, 
        default: []
    },
    votes: {
        type: Object
    }, 
    admin_status: {
        type: Boolean, 
        default: false
    }
});
const User = mongoose.model("User", UserSchema);
module.exports = User;