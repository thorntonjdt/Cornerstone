'use strict';

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoDB = require('./config').database;
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const expressStaticGzip = require("express-static-gzip");

mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", expressStaticGzip(path.join(__dirname, '../', 'public')));

io.on('connection', socket => {
	socket.join(socket.handshake.query.room);
});

app.use(function(req,res,next){
    req.io = io;
    next();
});

const manager = require('./routes/manager.js');
const tenant = require('./routes/tenant.js');
const publicRoute = require('./routes/public.js');
const auth = require('./routes/auth.js');

app.use('/api/v1/t', tenant);
app.use('/api/v1/m', manager);
app.use('/auth', auth);
app.use('/api/v1/p', publicRoute);

// for every request made, if the file doesn't exist, return index.html file.
app.get( '/*', (req, res) => {
	res.sendFile( path.join(__dirname, '../', 'public', 'index.html') );
});

app.use(function(error, req, res, next) {
	console.error(error);
 	res.send({error: error.message});
});

var maintenance = require('./config/maintenance.js');

setInterval(maintenance.updateVacancies, 1000 * 60 * 60 * 24);


http.listen( port, () => {
	console.log('Server running at http://localhost:%s', port);
});
