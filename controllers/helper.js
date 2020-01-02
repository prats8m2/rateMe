const USER = require('../models/user');
const SMS  = require('../models/sms');
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
 * @apiParam {String} firstName User's first name.
 * @apiParam {String} lastName User's last name.
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
 *          "message": "User validation failed: firstName: Path `firstName` is required.",
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
exports.sms = function (uid,logId) {
	// LOGS.printLogs(req,logId,0,"Registration process starts for: "+req.body.firstName+" "+req.body.lastName);
							SMS.findOne( { uid : uid},{count : {$exists: true}} ,function(err,result){
							if(!err)
							{
								if(result.count <= 3 || result.count % 2  == 1 ){
									console.log("Sendind SMS");
									count = result.count +1;
									SMS.updateOne({ uid : result[uid]},{$set: {count: count}}, function(err, res){
									if(err) throw err;
									console.log("Count is Update");
									});
								}
							}
							else{
									SMS.insetOne( { uid : uid},{count : 1} ,function(err,res){
									console.log("After instering : Sending SMS");
									if(err) throw err;
									console.log("Id is inserted");
								});
							}
							});
}
