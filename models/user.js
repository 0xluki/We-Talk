const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//define schema for the user information
const userSchema = new Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }
});

module.exports = mongoose.model('User', userSchema);