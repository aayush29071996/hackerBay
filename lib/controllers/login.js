
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


