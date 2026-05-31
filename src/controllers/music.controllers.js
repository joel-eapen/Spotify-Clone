const musicModel = require('../models/music.models.js');
const albumModel = require("../models/album.models.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { uploadFile } = require('../services/storage.services.js');

const musicController = async (req, res) => {

        const { title } = req.body;
        const file = req.file;
        const result = await uploadFile(file.buffer.toString('base64'));
        const newMusic = await musicModel.create({
            uri: result.url,
            title,
            artist: req.user.id
        })

        res.status(201).json({ message: 'Music uploaded successfully', music: newMusic })
   

};

const albumController = async (req, res) => {

        const { title, musics } = req.body;
        const newAlbum = await albumModel.create({
            title,
            artist: req.user.id,
            musics
        })
        res.status(201).json({
            message: 'Album created successfully', album: {
                id: newAlbum._id,
                title: newAlbum.title,
                musics: newAlbum.musics,
                artist: newAlbum.artist

            }
        })
    
};

const getMusicController = async (req,res)=>{
    const musics = await musicModel.find().populate('artist');
    res.status(200).json({
        message:'Musics retrieved successfully',
        musics
    })
};

const getAlbumController = async (req,res)=>{
    const albums = await albumModel.find().select('title artist').populate('artist', 'username email');
    res.status(200).json({
        message:'Albums retrieved successfully',
        albums
    })
};

const getAlbumMusicController = async (req,res)=>{
    const {albumId} = req.params;
    const albumMusic = await albumModel.findById(albumId).populate('musics').populate('artist','username email');
    res.status(200).json({
        message:'Album musics retrieved successfully',
        musics:albumMusic
    })
}

module.exports = { musicController, albumController, getMusicController, getAlbumController, getAlbumMusicController }