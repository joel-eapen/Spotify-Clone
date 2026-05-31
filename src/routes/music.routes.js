const express = require('express');
const router = express.Router();
const artistController = require('../controllers/music.controllers.js');
const authMiddleware = require('../middlewares/auth.middlewares.js');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});


// Artist login route
router.post('/artist-login',authMiddleware.authArtist,upload.single('music'),artistController.musicController);
router.post('/create-album',authMiddleware.authArtist,artistController.albumController);
//get all musics
router.get('/',authMiddleware.authUser,artistController.getMusicController);
router.get('/albums',authMiddleware.authUser,artistController.getAlbumController);
router.get("/albums/:albumId",authMiddleware.authUser,artistController.getAlbumMusicController);

module.exports = router;