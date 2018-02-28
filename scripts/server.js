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
const CronJob = require('cron').CronJob;

mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", expressStaticGzip(path.join(__dirname, '../', 'public')));


//Connect users to their own room, based on their manager/tenant _id
io.on('connection', socket => {
	socket.join(socket.handshake.query.room);
});
app.use((req,res,next) => {
    req.io = io;
    next();
});


//Routes
const managerRoutes = require('./routes/manager');
const tenantRoutes = require('./routes/tenant');
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
app.use('/api/v1/t', tenantRoutes);
app.use('/api/v1/m', managerRoutes);
app.use('/auth', authRoutes);
app.use('/api/v1/p', publicRoutes);


// for every request made, if the file doesn't exist, return index.html file.
app.get( '/*', (req, res) => {
	res.sendFile( path.join(__dirname, '../', 'public', 'index.html') );
});

//Error handler
app.use((error, req, res, next) => {
	console.error(error);
 	res.send({error: "Error"});
});


//Add new rent payments on the first of every month and update over-due transactions nightly
var maintenance = require('./helpers/maintenance');
var updateTransactions = new CronJob('00 30 1 * * 0-7', maintenance.nightly, null, true, 'America/Vancouver');
var updateLeases = new CronJob('00 30 1 1 * *', maintenance.monthly, null, true, 'America/Vancouver')

http.listen( port, () => {
	console.log('Server running at http://localhost:%s', port);
});
