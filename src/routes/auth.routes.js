const express = require('express');
const router = express.Router();
const authController = require ('../controllers/auth.controller.js');

//register route
router.post('/register',authController.registerUser);
//login route
router.post('/login',authController.loginUser);

module.exports = router;