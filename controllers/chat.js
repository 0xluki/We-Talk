//importing required packages
const fs = require('fs');
const moment = require('moment');
const formatMessage = require('../utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require('../utils/users');
const Message = require('../models/message');

//rendering the rooms page only if the user is logged in
exports.getRooms = (req, res, next) => {
    res.render('rooms',{
        pageTitle:'Chat Rooms',
        isAuthenticated:req.session.isLoggedIn
    })
}

//rendering the rooms page only if the user is logged in
exports.postChat = (req, res, next) => {
    const room = req.body.room;
    //fetching the old room messages sorted by date from DB
    Message.find({room: room})
    .populate('userId')
    .sort({date:1})
    .then(msgs => {
            //checking if the old data contains image
            //fetching the image base64 encoded file
            //then we replace the imagePath value with the base64 text 
            for(let message of msgs){
                if (message.imagePath){
                    message.imagePath = fs.readFileSync(message.imagePath,'utf-8');
                }
            }
            res.render('chat',{messages:msgs,
                isAuthenticated:req.session.isLoggedIn,
                pageTitle:'chat',
                moment:moment  
            });

        let socket_id = [];
    const io = req.app.get('socketio');

    io.on('connection', socket => {
        socket_id.push(socket.id);
        if (socket_id[0] === socket.id) {
            username = req.session.user.name

            const user = userJoin(socket.id, username, room);

            socket.join(user.room);



            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

            // Listen for chatMessage
            socket.on('chatMessage', (msg) => {
                const user = getCurrentUser(socket.id);
                const newMsg =  formatMessage(user.username, msg);
                //storing the message details in the DB
                const message = new Message({
                    msg:newMsg.text,
                    userId: req.session.user,
                    date: new Date (newMsg.time),
                    room: room

                })
                message.save().then(() => {
                    io.to(user.room).emit('message',formatMessage(user.username, msg, 'h:mm a, Do MMMM, YYYY'));
                })

                
            });

            socket.on('img', (imgData, callback) => {
                const user = getCurrentUser(socket.id);
                const newMsg =  formatMessage(user.username, imgData);
                //storing image as base64 the file name is generated using epoch time
                const file = `${Math.floor(new Date().getTime() / 1000)}`;
                fs.writeFile(`./uploads/${file}.txt`, imgData, (err) => {
                if (err)
                    console.log(err);
                });
                //storing image message details in DB
                const message = new Message({
                    imagePath: `./uploads/${file}.txt`,
                    userId: req.session.user,
                    date: new Date (newMsg.time),
                    room: room

                })
                message.save().then(() => {
                    io.to(user.room).emit('newImg', formatMessage(user.username, imgData, 'h:mm a, Do MMMM, YYYY'));
                })
                
            });
            

            // Runs when client disconnects
            socket.on('disconnect', () => {
                const user = userLeave(socket.id);

                if (user) {

                    // Send users and room info
                    io.to(user.room).emit('roomUsers', {
                        room: user.room,
                        users: getRoomUsers(user.room)
                    });
                }
            });
            // remove the connection listener for any subsequent 
            // connections with the same ID
            io.removeAllListeners('connection');
        }
    });
        
    });
    
}
