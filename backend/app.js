const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const forumsRoutes = require('./routes/forum');
const userRoutes = require('./routes/user');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Authorization', 'Content-disposition']
}));

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({
    extended: true
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/forum', forumsRoutes);

module.exports = app;