const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes.js');
const musicRoutes = require('./routes/music.routes.js');

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());

//Auth routes
app.use('/api/auth',authRoutes);
app.use('/api/music',musicRoutes);


module.exports = app;
