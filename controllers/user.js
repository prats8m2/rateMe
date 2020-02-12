//IMPORT LIBRARY
import jwt from "jsonwebtoken";

//IMPORT FILES
import USER from "../models/user";
import OTP from "../models/otp";
import LOGS from "../services/logs";
import BIND from "../services/bind";
import RESP from "../services/resp";
import CONST from "../constant";
import helper from "../controllers/helper";
import QUERY from "../models/query";



/**
 * @api {post} /reg Register User in system
 * @apiName Registration
 * @apiGroup User
 *
 * @apiParam {String} fullName User's full name.
 * @apiParam {String} password User's account password.
 * @apiParam {String} gender User's gender M/F.
 * @apiParam {String} mobile User's mobile number.
 * @apiParam {Number} otp User's OTP code.
 * 
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
 *          "message": "User validation failed: firstName: Path `fullName` is required.",
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
const register = async function (req, res) {
    try {
        var logId = LOGS.getlogId();//GET LOGID
        LOGS.printClientDataLogs(req, logId);//PRINT CLIENT DETAILS
        LOGS.printLogs(req, logId, 0, "Registration process starts for: " + req.body.fullName);//PRINT LOG

        var otpVerified = await verifyOTP(req.body.mobile, req.body.otp);

        if (otpVerified) {//IF OTP VERIFIED OR NOT
            //BIND DATA FOR USER REGISTRATION
            var bindData = await BIND.register(req.body);

            //BIND USER MODEL
            var newUser = new USER(bindData);

            //SAVE DATA IN USER COLLECTION
            await QUERY.save(newUser);

            //PRINT LOGS & SEND RESPONSE
            LOGS.printLogs(req, logId, 1, "Registration process SUCCESS for: " + req.body.fullName);
            RESP.send(res, true, "Registration Succesfull", null, { isLogged: req.body.isLogged });
        }
        else {
            //SEND INVALID OTP RESPONSE
            RESP.send(res, false, "Invalid OTP", CONST.ERROR.ACCOUNT_ALREADY_EXIST);
        }

    }
    catch (err) {
        //CHECK FOR ANY MONGO ERROR
        if (CONST.mongoDublicateError.indexOf(err.code) != -1) {
            LOGS.printLogs(req, logId, 3, err);
            RESP.send(res, false, "Account already exist", CONST.ERROR.ACCOUNT_ALREADY_EXIST);
        }
        else {
            //SEND DEFAULT ERROR
            RESP.send(res, false, e, CONST.ERROR.INTERNAL_SERVER_ERROR);
        }
    }


};
exports.register = register;

/**
 * @api {post} /login Login User in system
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam {String} mobile User's mobile number.
 * @apiParam {String} password User's account password.
 * @apiErrorExample {json} Error-Response:
 *        HTTP/9006 Invalid Mobile number or Password   
 *        {
 *   "status": false,
 *   "message": "Invalid Mobile number or Password",
 *   "err": 9006,
 *   "data": null
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/200 OK
 *     {
 *   "status": true,
 *   "message": "Login Succesfull",
 *   "err": null,
 *   "data": {
 *       "fullName": "AmitGupta",
 *       "email": null,
 *      "password": "1234",
 *       "gender": "M",
 *       "mobile": "9584117002",
 *       "token": "eyJhbGciOiJIUzI......1NiIsI"
 *       }
 *    }
 */

const login = async function (req, res) {
    try {

        var logId = LOGS.getlogId();
        LOGS.printClientDataLogs(req, logId);
        LOGS.printLogs(req, logId, 0, "Login process starts for: " + req.body.mobile);

        //BIND DATA FOR LOGIN USER LOGIN
        var bindData = await BIND.login(req.body);

        var userData = await QUERY.findOne(USER, { mobile: bindData.mobile, password: bindData.password });

        if (userData && userData.fullName) {

            LOGS.printLogs(req, logId, 1, "Login process SUCCESS for: " + result[0].fullName);

            //CREATE JWT TOKEN AFTER VALIDATING CREDS
            var token = jwt.sign({ userId: result[0]._id }, 'shhhhh', { expiresIn: 60 });

            //ADD ADDITIAONAL PARAM FOR DEV PURPOSE
            result[0].isLogged = req.body.isLogged;

            //BIND LOGIN RESPONSE DATA
            var respData = await BIND.loginResp(userData, token);

            // SEND RESPONSE
            RESP.send(res, true, "Login Succesfull", null, respData);

        }
        else {
            LOGS.printLogs(req, logId, 3, "Login process Failed for: " + req.body.mobile);
            RESP.send(res, false, "Invalid Mobile number or Password", CONST.ERROR.Invalid_Mobile_number_or_Password);
        }
    }
    catch (e) {
        //SEND DEFAULT ERROR
        RESP.send(res, false, e, CONST.ERROR.INTERNAL_SERVER_ERROR);
    }

};
exports.login = login;

/**
 * @api {get} /user Give user account details
 * @apiName Get user
 * @apiGroup User
 *
 * @apiParam {String} token User's auth token.
 * 
 * @apiErrorExample {json} Error-Response:
 *        HTTP/9001 Invalid Token
 * 	{
 *   "status": false,
 *   "message": "Invalid Token",
 *   "err": 9001,
 *   "data": null
 * }
 *        HTTP/9001 Missing Token
 * 	{
 *   "status": false,
 *   "message": "Missing Token",
 *   "err": 9000,
 *   "data": null
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/200 OK
 *     {
 *  "status": true,
 *   "message": "Success",
 *  "err": null,
 *   "data": {
 *       "settings": {
 *           "notification": 1
 *      },
 *     "role": 1,
 *      "status": 1,
 *       "ratings": [],
 *       "contacts": [],
 *        "_id": "5df9f6ec6c703d65e1c57eab"
 *       "fullName": "AmitGupta",
 *       "email": null,
 *       "password": "1234",
 *       "gender": "M",
 *       "mobile": "9584117002",
 *       "created": "1576662764479",
 *       "ratingCount": 0,
 *       "updated": "2019-12-18T09:52:44.484Z",
 *       "__v": 0
 *   }
 * }
 */
const getUser = async function (req, res) {
    try {
        //PRINT LOGS & FETCH DATA
        var logId = LOGS.getlogId();
        var userId = req.user.userId;
        LOGS.printClientDataLogs(req, logId);
        LOGS.printLogs(req, logId, 0, "Fetch User details process starts for: " + userId);

        //FETCH USER FROM DB
        var userData = await QUERY.findOne(USER, { _id: userId });

        //IF USER FOUND IN DB 
        if (userData && userData.fullName) {
            LOGS.printLogs(req, logId, 1, "Get User SUCCESS for: " + userData.fullName);
            
            //BIND USER DATA RESPONSE
            var respData = await BIND.getUserResp(userData);
            
            //SEND RESPONSE
            RESP.send(res, true, "Success", null, respData);
        }
        else {//IF USER NOT FOUND IN DB
            LOGS.printLogs(req, logId, 3, "Get User Failed for: " + userId);
            
            //SEND RESPONSE
            RESP.send(res, false, "No Result Found");
        }
    }
    catch (e) {//ERROR HANDLING
        RESP.send(res, false, e, CONST.ERROR.INTERNAL_SERVER_ERROR);
    }

};
exports.getUser = getUser;



/**
 * @api {get} /sendPass Send User password to his/her number
 * @apiName Send Password
 * @apiGroup User
 *
 * @apiParam {String} mobile User's mobile number.
 * @apiParam {String} apiKey Server API Key.
 * @apiParam {Number} time Current timestamp in sec.
 */
const sendPass = async function (req, res) {
    try {
        var logId = LOGS.getlogId();
        var number = req.body.mobile;
        LOGS.printClientDataLogs(req, logId);
        LOGS.printLogs(req, logId, 0, "Sent User PIN to its number process starts for: " + number);
        USER.find({ mobile: number }, function (err, result) {
            if (!err) {
                if (result.length && result[0].fullName) {
                    LOGS.printLogs(req, logId, 1, "User details fetched succefully for: " + result[0].fullName);
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
    }
    catch (e) {
        RESP.send(res, false, e, CONST.ERROR.INTERNAL_SERVER_ERROR);
    }

};
exports.sendPass = sendPass;

/**
 * @api {post} /sentOTP Send User otp to his/her number
 * @apiName Send OTP
 * @apiGroup User
 *
 * @apiParam {String} mobile User's mobile number.
 * 
 */
const sentOTP = async function (req, res) {
    try {
        var logId = LOGS.getlogId();
        var mobile = req.body.mobile;
        LOGS.printClientDataLogs(req, logId);
        LOGS.printLogs(req, logId, 0, `Sent User PIN to its number process starts for:${mobile}`);
        var otp = helper.generateOTP();
        OTP.find({ $and: [{ mobile: mobile }] }, function (err, result) {
            if (!err) {
                if (result.length) {
                    var otpData = {
                        "otp": otp
                    };
                    OTP.findOneAndUpdate({ mobile: mobile }, { otp: otp }, function (err, result) {
                        RESP.send(res, true, "OTP Send Succesfull", otpData);
                        LOGS.printLogs(req, logId, 0, `OTP ${otp} sent successfuly for:${mobile}`);
                    });
                }
                else {
                    var otpData = new OTP({
                        "mobile": mobile,
                        "otp": otp
                    });
                    otpData.save(function (err, result) {
                        RESP.send(res, true, "OTP send Succesfully", otpData);
                        LOGS.printLogs(req, logId, 0, `OTP ${otp} sent successfuly for:${mobile}`);

                    });
                }
            }
        });

    }
    catch (e) {
        RESP.send(res, false, e, CONST.ERROR.INTERNAL_SERVER_ERROR);
    }


};
exports.sentOTP = sentOTP;

//VERIFY OTP OF USER
const verifyOTP = async function (mobile, otp) {
    let where = {
        'mobile': mobile,
        'otp': otp
    }
    var result = await QUERY.findOne(OTP, where);
    if (result && result.length) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * @api {get} /getOTP Get User otp by his/her number
 * @apiName Get OTP
 * @apiGroup User
 *
 * @apiParam {String} mobile User's mobile number.
 * 
 */
const getOTP = async function (req, res) {
    var where = {
        'mobile': req.query.mobile
    }
    var result = await QUERY.findOne(OTP, where);
    res.send(result);
}
exports.getOTP = getOTP;