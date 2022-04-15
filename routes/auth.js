const express = require('express');

//importing the controllers
const authController = require('../controllers/auth');

//using router to handel the routes
const router = express.Router();

//registering the auth related routes
router.get('/', authController.getIndex);

router.post('/signup', authController.postSignup);

router.post('/login', authController.postLogin);

router.get('/logout', authController.getLogout);

module.exports = router;