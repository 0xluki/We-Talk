const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//define schema for the contact form
const contactSchema = new Schema({
    name:{
        required: true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    message:{
        required:true,
        type:String
    }
});

module.exports = mongoose.model('Contact', contactSchema);