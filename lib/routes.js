
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