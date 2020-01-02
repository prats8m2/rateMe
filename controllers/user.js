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
exports.register = function (req, res) {
   var logId  = LOGS.getlogId();

   LOGS.printClientDataLogs(req,logId);
   LOGS.printLogs(req,logId,0,"Registration process starts for: " +req.body.fullName);
   BIND.register(req.body,function(bindData){
       var newUser = new USER(bindData);
        newUser.save(function (err,result) {
            if (!err) {
                LOGS.printLogs(req,logId,1,"Registration process SUCCESS for: "+req.body.fullName); 
                RESP.send(res,true,"Registration Succesfull");            
            } else {
                if(CONST.mongoDublicateError.indexOf(err.code) != -1){
                    LOGS.printLogs(req,logId,3,err);
                    RESP.send(res,false,"Account already exist",CONST.ERROR.ACCOUNT_ALREADY_EXIST);                
                }
                else{
                    LOGS.printLogs(req,logId,3,err);
                    RESP.send(res,false,err,CONST.ERROR.INTERNAL_SERVER_ERROR);
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

exports.login = function(req,res){
    var logId  = LOGS.getlogId();
    LOGS.printClientDataLogs(req,logId);
    LOGS.printLogs(req,logId,0,"Login process starts for: "+req.body.mobile);
    BIND.login(req.body,function(bindData){
        USER.find( { $and: [ { mobile : bindData.mobile }, { password: bindData.password } ] } ,function(err,result){
            if (!err) {
                if(result.length && result[0].fullName){
                    LOGS.printLogs(req,logId,1,"Login process SUCCESS for: "+result[0].fullName);
                    jwt.sign({ userId: result[0]._id }, "Shhhh",{expiresIn:60}, function(err, token) {
                        BIND.loginResp(result[0],token,function(respData){
                            RESP.send(res,true,"Login Succesfull",null,respData);            
                        });
                    }); 
                }
                else{
                    LOGS.printLogs(req,logId,3,"Login process Failed for: "+req.body.mobile); 
                    RESP.send(res,false,"Invalid Mobile number or Password",CONST.ERROR.Invalid_Mobile_number_or_Password);
                }
            } else {
                LOGS.printLogs(req,logId,3,err);
                RESP.send(res,false,err,CONST.ERROR.INTERNAL_SERVER_ERROR);
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
exports.getUser = function(req,res){
    var logId  = LOGS.getlogId();
    var userId = req.user.userId;
    LOGS.printClientDataLogs(req,logId);
    LOGS.printLogs(req,logId,0,"Fetch User details process starts for: "+userId);
        USER.find( { _id : userId} ,function(err,result){
            if (!err) {
                if(result.length && result[0].fullName){
                    LOGS.printLogs(req,logId,1,"Get User SUCCESS for: "+result[0].fullName);
                    BIND.getUserResp(result[0],function(respData){
                        RESP.send(res,true,"Success",null,respData);
                    });         
                }
                else{
                    LOGS.printLogs(req,logId,3,"Get User Failed for: "+userId); 
                    RESP.send(res,false,"No Result Found");
                }
            } else {
                LOGS.printLogs(req,logId,3,err);
                RESP.send(res,false,err,CONST.ERROR.INTERNAL_SERVER_ERROR);
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
exports.sendPass = function(req,res){
    var logId  = LOGS.getlogId();
    var number = req.body.mobile;
    LOGS.printClientDataLogs(req,logId);
    LOGS.printLogs(req,logId,0,"Sent User PIN to its number process starts for: "+number);
        USER.find( { mobile : number} ,function(err,result){
            if (!err) {
                if(result.length && result[0].fullName){
                    LOGS.printLogs(req,logId,1,"User details fetched succefully for: "+result[0].fullName);
                    RESP.send(res,true,"Success",null,null);         
                }
                else{
                    LOGS.printLogs(req,logId,3,"No User found for: "+number); 
                    RESP.send(res,false,"No Result Found");
                }
            } else {
                LOGS.printLogs(req,logId,3,err);
                RESP.send(res,false,"Internal Server Error",err);
            }
    });
};