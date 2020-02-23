var jwt = require('jsonwebtoken');
var md5 = require('md5');

const RESP = require('../services/resp');
const LOGS = require('../services/logs');
const USER = require('../controllers/user');
const RATING = require('../controllers/ratings');
const CONST = require('../constant');




module.exports.route = function (app) {

    app.post('/reg', USER.register);
    app.post('/login', USER.login);
    app.get('/user', authenticate, USER.getUser);
    app.post('/sendPass', secureAPI, USER.sendPass);
    app.post('/rate', ratingDataValidation, authenticate, RATING.rating);
    app.post('/ratingEdit', authenticate, RATING.ratingEdit);
    app.get('/getUserRating', authenticate, RATING.getUserRating);
    app.post('/sendOTP', USER.sentOTP);
    app.get('/getOTP', USER.getOTP);
    app.post('/sync', authenticate, USER.syncContact);

};

function authenticate(req, res, next) {
    var logId = LOGS.getlogId();
    if (req.query.token || req.body.token || req.headers.token) {
        let token = req.query.token ? req.query.token : (req.body.token ? req.body.token : req.headers.token);
        LOGS.printLogs(req, logId, 0, "Authentication process starts for: " + token);
        jwt.verify(token, 'shhhhh', function (err, decoded) {
            if (!err) {
                LOGS.printLogs(req, logId, 1, "Authentication process Success for: " + decoded.userId);
                req.user = {};
                req.user.userId = decoded.userId;
                next();
            }
            else {
                console.log(err);
                LOGS.printLogs(req, logId, 3, "Authentication token Invalid: " + token);
                RESP.send(res, false, "Invalid Token", CONST.ERROR.INVALID_TOKEN);
            }
        });
    }
    else {
        LOGS.printLogs(req, logId, 1, "Authentication token missing");
        RESP.send(res, false, "Missing Token", CONST.ERROR.MISSING_TOKEN);
    }
}

function secureAPI(req, res, next) {
    var logId = LOGS.getlogId();
    var currentTime = Math.floor(Date.now() / 1000);
    if (req.query.apiKey || req.body.apiKey) {
        let apiKey = req.query.apiKey ? req.query.apiKey : req.body.apiKey;
        let time = req.query.time ? req.query.time : req.body.time;
        if (currentTime - time < CONST.TOKEN_EXPIRY_WINDOW) {
            LOGS.printLogs(req, logId, 0, "API Authentication process starts for API Key: " + apiKey);
            if (apiKey == md5(md5(time + "rateme" + time))) {
                LOGS.printLogs(req, logId, 1, "Authentication process Success for API key");
                next();
            }
            else {
                LOGS.printLogs(req, logId, 3, "API key Invalid: " + apiKey);
                RESP.send(res, false, "Invalid API Key", CONST.ERROR.INVALID_API_KEY);
            }
        }
        else {
            LOGS.printLogs(req, logId, 3, "API key Expired: " + apiKey);
            RESP.send(res, false, "Expired API Key", CONST.ERROR.EXPIRED_API_KEY);
        }
    }
    else {
        LOGS.printLogs(req, logId, 1, "API key missing");
        RESP.send(res, false, "Missing API key", CONST.ERROR.MISSING_API_KEY);
    }
}

function ratingDataValidation(req,res,next){
    var rating = req.body.rating;
    var flag = 0;
    for(var idx in rating){
        if(rating[idx] > 10 || rating[idx] < 1){
            flag = 1;
        }
    }
        if(flag){
            RESP.send(res, false, "Invalid Rating Data", CONST.ERROR.INVALID_DATA);
        }
        else{
            next();
        }
}