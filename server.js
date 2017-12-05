
//Require all the needed node modules for server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var path = require('path');
var config = require('./config');

// Specify your port here
var port = process.env.PORT || 9000;

//Connect to database and the super key from here
var connection = mongoose.connect(config.database);
app.set('superSecret', config.secret);
autoIncrement.initialize(connection);


// Produce readable logs on console through morgan
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Landing page
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port );
});

// Require the Routes.js
require("./lib/routes.js")(app);

//Initiate the server
server.listen(port);
console.log('App is listening on port: ' + port);