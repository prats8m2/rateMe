const USER = require('../models/user');
const RATINGS = require('../models/ratings');
const LOGS = require('../services/logs');
const BIND = require('../services/bind');
const RESP = require('../services/resp');
const CONST = require('../constant');


/**
 * @api {post} /rate Rate other users
 * @apiName Rate Friend
 * @apiGroup Rate
 *
 * @apiParam {String} token User's auth token.
 * @apiParam {String} mobile User's friend mobile number.
 * @apiParam {Object} rating Full rating object.
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
exports.rating = function (req, res) {
    var logId  = LOGS.getlogId();
    LOGS.printClientDataLogs(req,logId);
    LOGS.printLogs(req,logId,0,"Rating process starts for: "+req.body.mobile);
    
 };
 