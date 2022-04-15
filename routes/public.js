const express = require('express');

//importing the controllers
const publicContoller = require('../controllers/public');

//using router to handel the routes
const router = express.Router();

//registering the public related routes

router.get('/contact-us', publicContoller.getContactUs);

router.post('/contact-us', publicContoller.postContactUs);

module.exports = router;