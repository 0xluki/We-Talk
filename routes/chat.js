const express = require('express');

//importing the controllers
const chatController = require('../controllers/chat');
const authController = require('../controllers/auth');

//using router to handel the routes
const router = express.Router();

//registering the chat related routes
router.post('/chat', authController.isAuthed, chatController.postChat);

router.get('/rooms', authController.isAuthed, chatController.getRooms);

module.exports = router;