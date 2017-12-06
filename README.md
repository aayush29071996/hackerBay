# hackerBay
NodeTask

This project basically involves 3 basic node tasks-


1.Authentication

2.JSON patching

3.Image Thumbnail Generation

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

"NPM INSTALL"- to install all the required dependencies.

### Prerequisites

What things you need to install the software and how to install them-
1. You need to install node and mongo db .
2. You also need to install all the other dependencies specified in the package.json file.

```
"dependencies": {
    "async": "^2.5.0",
    "body-parser": "^1.18.2",
    "bower": "^1.8.0",
    "express": "^4.16.2",
    "fast-json-patch": "^2.0.6",
    "fs": "0.0.1-security",
    "http-status": "^0.2.3",
    "image-downloader": "^3.3.0",
    "jsonwebtoken": "^8.1.0",
    "moment": "^2.19.3",
    "mongoose": "^4.13.6",
    "mongoose-auto-increment": "^5.0.1",
    "mongoose-unique-validator": "^1.0.3",
    "morgan": "^1.9.0",
    "node-fs": "^0.1.7",
    "node-image-resize": "0.0.2",
    "nodemon": "^1.11.0",
    "request": "^2.83.0"
  }
```

### Installing

1.NPM INSTALL

### Running

1. NPM START


This process will initiate the server on port 9000 and then you can test the API.
```
> node server.js

App is listening on port: 9000
```

## Running the project and seeing the results through postman
1. Register a new user
```
var User = require('../models/user');


exports.register = function(req, res) {

    //PARSE THE REQUEST DATA
    var newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    //CREATE A NEW USER IN DB
    newUser.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');

        //SEND RESPONSE HERE
        res.json({ success: true });
    });

};
```
2. User schema
```

//USER SCHEMA IS DEFINED HERE AS PER MONGODB SYNTAX

var mongoose = require('mongoose');
Schema = mongoose.Schema;


var UserSchema = new mongoose.Schema({

    username:{type:String},
    password:{type:String}

});

var User = mongoose.model('User', UserSchema);
module.exports = User
```
3.Authentication and JWT token generation

```

//REQUIRE ALL THE USEFUL MODULES HERE
var User = require('../models/user');
var jwt    = require('jsonwebtoken');
var express = require('express');
var app = express();
var config = require('../../config');

//SET THE SUPERSECRET KET FROM CONFIG FILE HERE
app.set('superSecret', config.secret);



exports.authenticate = function(req, res){

  //FIND THE MATCHING USER FROM THE DB
  User.findOne({
    username: req.body.username
  },
      function(err, user) {
        //IF ERROR THEN THROW ERROR
    if (err) throw err;

        //IF NOT FOUND SUITABLE USER THEN FAIL THE AUTHENTICATION
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }

    //IF FOUND SUCCESSFUL USER THEN CHECK IF PASSWORD IS VALID WITH DB PASSWORD
    else if (user) {

      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      }

      //IF FOUND THE ACTUAL AUTHENTICATED USER THEN SEND THE PAYLOAD ALONG WITH TOKEN
      else {

        const payload = {
        //CAN ENTER PAYLOAD HERE
        };

        //CREATE A JWT SIGNED TOKEN
        var token = jwt.sign(payload, app.get('superSecret'), {
        });

        //SEND TOKEN AS A RESPONSE
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });

};

```

4. JSON PATCHING

```
//Require the JSON PATCH NPM MODULE
var jsonpatch = require('fast-json-patch');

exports.patcher = function(req, res) {


    //PARSE THE ORIGNAL DOCUMENT HERE
    var document = { firstName: req.body.jsonObject };

    //PARSE THE NEW PATCH OBJECT AND FUNCTION HERE
    var operation = { op: "replace", path: "/firstName", value: req.body.jsonPatchObject };


    //PERFORM THE PATCH OPERATION HERE
    document = jsonpatch.applyOperation(document, operation).newDocument;

    //SEND RESPONSE HERE DOCUMENT
    res.json({
        success: true,
        message: 'Enjoy your patch!',
        document: document
    });


};
```

5.Thumbnail generation

```
var fs = require('fs');
var ImageResize = require('node-image-resize');
var request = require('request');
var moment = require('moment');




exports.thumbnailMaker = function(req, res) {

    //DOWNLOAD FUNCTION FOR THE IMAGE THROUGH URL
    var download = function(uri, filename, callback){

        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };


    //PARSE THE URL AND SPECIFY FILENAME
    var  uri= req.body.url;
    var filename = moment.utc()+".jpg";

    //DOWNLOAD THE FILE
    download( uri , filename , function(){
        console.log('done');

        //USE IMAGE THUMBNAIL MIDDLEWARE MODULE TO RESIZE
        var image = new ImageResize(filename);

            image.smartResizeDown({
                width: 50,
                height: 50
            }).then(function () {

                //STORE IT IN ROOT DIRECTORY
                image.stream(function (err, stdout, stderr) {
                    var writeStream = fs.createWriteStream('./resized'+filename);
                    stdout.pipe(writeStream);

                    //SEND AS A RESPONSE
                    writeStream.pipe(res);

                    res.json({
                        success: true,
                        message: 'Enjoy your thumbnail!'

                    });

                });
            });

    });




};
```
6. Routes.js and securing routes
```

//REQUIRE ALL THE CONTROLLERS AND MODELS HERE

var LoginController = require('./controllers/login');
var RegisterController = require('./controllers/register');
var User = require('./models/user');
var jsonPatchingController = require('./controllers/jsonPatching');
var jwt = require('jsonwebtoken');
var thumbnailController = require('./controllers/thumbnail');


module.exports = function(app) {

    //CALL THE REGISTER CONTROLLER TO REGISTER A NEW USER
    app.post('/setup', RegisterController.register);

    //CALL THE LOGIN CONTROLLER TO AUTHENTICATE THE USER AND GENERATE A TOKEN
    app.post('/authenticate', LoginController.authenticate);

    //SECURE ALL THE ROUTES BY CHECKING FOR A VALID JWT TOKEN
    app.use(function(req, res, next) {

        // CHECK HEADER OR URL PARAMETERS OR POST PARAMETERS FOR TOKEN
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // DECODE TOKEN
        if (token) {

            // VERIFY SECRET AND CHECK AUTHENTICATION
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {

                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            //IF THERE IS NO TOKEN SEND ERROR
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

//API'S WITH SECURED ENDPOINTS

    //API TO SEE ALL THE USERS IN THE DB
    app.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            res.json(users);
        });
    });

    //JOSN PATCH SECURED API
    app.post('/jsonPatch',jsonPatchingController.patcher);

    //THUMBNAIL SECURED API
    app.post('/thumbnail',thumbnailController.thumbnailMaker);


}
```
7.Server.js
```

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
```



## Sample Testing With Mocha
```
//TEST IN MOCHA



//IMPORT THE USER SCHEMA
var User = require('../lib/models/user');
var assert = require('assert');


exports.register = function(req, res) {

    //PARSE THE REQUEST DATA
    var newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    //CREATE A NEW USER IN DB
    newUser.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');

        //SEND RESPONSE HERE
        res.json({ success: true });
    });

};



describe('User', function() {
    describe('#save()', function() {
        it('should save without error', function(done) {
            var user = new User({username:"Luna",password:"password"});
            user.save(done);
        });
    });
});
```

RUN WITH "NPM TEST" COMMAND

## Built With

* [Authentication]- JWT Json Web Token
* [Json Patching] - fast-json-patch
* [Image Thumbnail Generation]- node-image-resize


## Authors

Aayush Patel


## Acknowledgments

* This task was given by hackerBay
