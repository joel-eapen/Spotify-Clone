const express = require('express');
const router = express.Router();
const artistController = require('../controllers/music.controllers.js');


// Artist login route
router.post('/artist-login',artistController.loginArtist);

module.exports = router;