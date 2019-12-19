const USER = require('../models/user');
const LOGS = require('../services/logs');
const BIND = require('../services/bind');
const RESP = require('../services/resp');
const CONST = require('../constant');
var jwt = require('jsonwebtoken');


/**
 * @api {post} /reg Register User in system
 * @apiName Registration
 * @apiGroup User
 *
 * @apiParam {String} fullName User's full name.
 * @apiParam {String} password User's account password.
 * @apiParam {String} gender User's gender M/F.
 * @apiParam {String} mobile User's mobile number.
 * 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/9005 Account already exist
 *       {
 *           "status": false,
 *           "message": "Account already exist",
 *           "err": 9005,
 *           "data": null
 *       }
 *       HTTP/500 Internal server error
 *      {
 *          "status": false,
 *          "message": "User validation failed: fullName: Path `fullName` is required.",
 *          "err": 500,
 *          "data": null
 *       }
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/200 OK
 *     {
 *       "status": true,
 *       "message": "Registration Succesfull",
 *       "err": null,
 *       "data": null
 *      }
 */
exports.register = function (req, res) {
    var logId = LOGS.getlogId();
    LOGS.printClientDataLogs(req, logId);
    LOGS.printLogs(req, logId, 0, "Registration process starts for: " + req.body.fullName);
    BIND.register(req.body, function (bindData) {
        var newUser = new USER(bindData);
        newUser.save(function (err, result) {
            if (!err) {
                LOGS.printLogs(req, logId, 1, "Registration process SUCCESS for: " + req.body.fullName );
                RESP.send(res, true, "Registration Succesfull");
            } else {
                if (CONST.mongoDublicateError.indexOf(err.code) != -1) {
                    USER.findOne({ mobile: bindData.mobile }, function (err, result) {
                        if (!err) {
                            if (result) {
                                if (result.isRegistered) {
                                    LOGS.printLogs(req, logId, 3, err);
                                    RESP.send(res, false, "Account already exist", CONST.ERROR.ACCOUNT_ALREADY_EXIST);
                                }
                                else {
                                    USER.update({ _id: result._id }, { 'isRegistered': 1 }, function (err, result) {
                                        if (!err) {
                                            LOGS.printLogs(req, logId, 1, "Registration process SUCCESS for: " + req.body.firstName + " " + req.body.lastName);
                                            RESP.send(res, true, "Registration Succesfull");
                                        }
                                        else {
                                            LOGS.printLogs(req, logId, 3, err);
                                            RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
                                        }
                                    });
                                }
                            }
                            else {
                                LOGS.printLogs(req, logId, 3, err);
                                RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
                            }
                        }
                        else {
                            LOGS.printLogs(req, logId, 3, err);
                            RESP.send(res, false, "Account already exist", CONST.ERROR.ACCOUNT_ALREADY_EXIST);
                        }
                    });
                }
                else {
                    LOGS.printLogs(req, logId, 3, err);
                    RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
                }
            }
        });
    });
};

/**
 * @api {post} /login Login User in system
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam {String} mobile User's mobile number.
 * @apiParam {String} password User's account password.
 * 
 * @apiSuccess {Boolean} status Status of the API Response.
 * @apiSuccess {String} message messsge of the API Response.
 * @apiSuccess {Object} err  Error messsge of the API Response.
 * @apiSuccess {Object} data  Data of the API Response.
 */

exports.login = function (req, res) {
    var logId = LOGS.getlogId();
    LOGS.printClientDataLogs(req, logId);
    LOGS.printLogs(req, logId, 0, "Login process starts for: " + req.body.mobile);
    BIND.login(req.body, function (bindData) {
        USER.findOne({ $and: [{ mobile: bindData.mobile }, { password: bindData.password }] }, function (err, result) {
            if (!err) {
                if (result) {
                    LOGS.printLogs(req, logId, 1, "Login process SUCCESS for: " + result.fullName);
                    jwt.sign({ userId: result._id }, "Shhhh", { expiresIn: '60Y' }, function (err, token) {
                        BIND.loginResp(result, token, function (respData) {
                            RESP.send(res, true, "Login Succesfull", null, respData);
                        });
                    });
                }
                else {
                    LOGS.printLogs(req, logId, 3, "Login process Failed for: " + req.body.mobile);
                    RESP.send(res, false, "Invalid Mobile number or Password");
                }
            } else {
                LOGS.printLogs(req, logId, 3, err);
                RESP.send(res, false, "Internal Server Error", err);
            }
        });
    });
}

/**
 * @api {get} /user Give user account details
 * @apiName Get user
 * @apiGroup User
 *
 * @apiParam {String} token User's auth token.
 * 
 * @apiSuccess {Boolean} status Status of the API Response.
 * @apiSuccess {String} message messsge of the API Response.
 * @apiSuccess {Object} err  Error messsge of the API Response.
 * @apiSuccess {Object} data  Data of the API Response.
 *
 */
exports.getUser = function (req, res) {
    var logId = LOGS.getlogId();
    var userId = req.user.userId;
    LOGS.printClientDataLogs(req, logId);
    LOGS.printLogs(req, logId, 0, "Fetch User details process starts for: " + userId);
    USER.findOne({ _id: userId }, function (err, result) {
        if (!err) {
            if (result.length) {
                LOGS.printLogs(req, logId, 1, "Get User SUCCESS for: " + result.fullName);
                BIND.getUserResp(result, function (respData) {
                    RESP.send(res, true, "Success", null, respData);
                });
            }
            else {
                LOGS.printLogs(req, logId, 3, "Get User Failed for: " + userId);
                RESP.send(res, false, "No Result Found");
            }
        } else {
            LOGS.printLogs(req, logId, 3, err);
            RESP.send(res, false, "Internal Server Error", err);
        }
    });
};



/**
 * @api {get} /sendPass Send User password to his/her number
 * @apiName Send Password
 * @apiGroup User
 *
 * @apiParam {String} mobile User's mobile number.
 * @apiParam {String} apiKey Server API Key.
 * @apiParam {Number} time Current timestamp in sec.
 * 
 *
 */
exports.sendPass = function (req, res) {
    var logId = LOGS.getlogId();
    var number = req.body.mobile;
    LOGS.printClientDataLogs(req, logId);
    LOGS.printLogs(req, logId, 0, "Sent User PIN to its number process starts for: " + number);
    USER.findOne({ mobile: number }, function (err, result) {
        if (!err) {
            if (result) {
                LOGS.printLogs(req, logId, 1, "User details fetched succefully for: " + result.fullName);
                RESP.send(res, true, "Success", null, null);
            }
            else {
                LOGS.printLogs(req, logId, 3, "No User found for: " + number);
                RESP.send(res, false, "No Result Found");
            }
        } else {
            LOGS.printLogs(req, logId, 3, err);
            RESP.send(res, false, "Internal Server Error", err);
        }
    });
};




