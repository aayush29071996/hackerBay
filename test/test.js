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