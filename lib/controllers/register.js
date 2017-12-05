
//IMPORT THE USER SCHEMA
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