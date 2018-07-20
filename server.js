var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var router = express.Router();
app.use(bodyParser());
var request = require('request');
var utility = require('./utility/utility');
var requiredFields = require('./config/required_fields');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;
var PORT = process.env.PORT || 3000

mongoose.connect('mongodb://localhost:27017/wowsomedb');



app.use('/client', express.static(__dirname + '/client/'));
app.use('/js', express.static(__dirname + '/client/js/'));
app.use('/bower_components', express.static(__dirname + '/bower_components/'));
app.use('/css', express.static(__dirname + '/client/css/'));
app.use('/images', express.static(__dirname + '/client/images/'));
app.use('/fonts', express.static(__dirname + '/client/font/'));
/************* server controller defining ************/
var wowsomeUsers = require('./controllers/wowsomes.controller');


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/views/index.html');
});

    app.post( '/api/wowsome', utility.checkRequiredFields(requiredFields.USER), utility.validateEmailAndMobile, wowsomeUsers.verifyUserByEmail, wowsomeUsers.create)
    app.post('/api/wowsomes/login', utility.checkRequiredFields(requiredFields.LOGIN),wowsomeUsers.findUserByEmailId,wowsomeUsers.findUserByLogin,wowsomeUsers.checkTokenExists,wowsomeUsers.login,wowsomeUsers.updateUserLoginStatus(true));
   

// route middleware to verify a token
app.use(function (req, res, next) {
    var full_url = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.info("Requested API: " + req.method + " - " + full_url);
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
        //token = undefined
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, requiredFields.JWT_SECRET, function (err, decoded) {
            if (err) {
                console.error("Server:: " + err.name + ": " + err.message);
                var retunrData = utility.ApiResponse(403, true,  "TOKEN EXPIRED", " ", res);
                
            } else {
                // if everything is good, save to request for use in other routes
                console.info("Server:: Token verified...");
                req.decoded = decoded;
                res.setHeader('x-access-token', token);
               // req.io = io;
                next();
            }
        });

    } else {
        // if there is no token return an error
        console.warn("Server:: No token");

        return utility.ApiResponse(403, false, "NO TOKEN", "", res);
       
    }
});


app.get('/api/wowsomes/:email/userdetails', wowsomeUsers.getwowsomesUserDetails);
app.put('/api/wowsomes/logout',wowsomeUsers.logout, wowsomeUsers.updateUserLoginStatus(false));




/*server listening at 3000 port*/
var server = app.listen(PORT, function () {
    console.log("Node app listening... at port:", PORT);
})

