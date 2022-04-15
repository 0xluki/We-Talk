const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//define schema for the user message
const messageSchema = new Schema({
    msg:{
        type:String
    },
    imagePath:{
        type:String
    },
    userId:{
        requried: true,
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    date:{
        requried: true,
        type:Date
    },
    room:{
        reuired: true,
        type:String
    }
});

module.exports = mongoose.model('Message', messageSchema);