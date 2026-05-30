const mongoose = require('mongoose');

//User Schema
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','artist'],
        default:'user'
    }
});

//User Model

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;