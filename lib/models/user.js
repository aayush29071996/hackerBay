
//USER SCHEMA IS DEFINED HERE AS PER MONGODB SYNTAX

var mongoose = require('mongoose');
Schema = mongoose.Schema;


var UserSchema = new mongoose.Schema({

    username:{type:String},
    password:{type:String}

});

var User = mongoose.model('User', UserSchema);
module.exports = User;