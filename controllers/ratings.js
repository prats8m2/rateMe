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
    var logId = LOGS.getlogId();
    LOGS.printClientDataLogs(req, logId);
    LOGS.printLogs(req, logId, 0, "Rating process starts for: " + req.body.mobile);

    var mobile = req.body.mobile;
    var rating = req.body.rating;
    var userId = req.user.userId;
    var review = req.body.review;
    var privacy = req.body.privacy ? req.body.privacy : 0;


    //CHECK IF NUMBER IS ALREADY REGISTERED AS USER 
    USER.findOne({ mobile: mobile }, function (err, result) {
        if (result) {//IF USER EXIST ALREADY IN DB
            let friendId = result._id;
            //CHECK FOR DUBLICATE RATING
            RATINGS.findOne({ $and: [{ uid: userId }, { fid: friendId }] }, function (err, result) {
                if (refidsult) {
                    LOGS.printLogs(req, logId, 3, "Dublicate Rating");
                    RESP.send(res, false, "Dublicate Rating", CONST.ERROR.DUBLICATE_RATING);
                }
                else {
                    insertRating(logId, req, res, userId, friendId, rating, review, privacy);//CALL INSERT RATING FUNCTION
                    updateRatingCount(logId,friendId);// CALL UPDATE RATING FUNCTION 
                }
            });
        }
        else { // IF USER NOT EXIST IN DB
            BIND.registerViaRating(mobile, function (bindData) {
                var newUser = new USER(bindData);
                newUser.save(function (err, result) {
                    if (!err) {
                        let friendId = result._id;
                        insertRating(logId, req, res, userId, friendId, rating, review, privacy);//CALL INSERT RATING FUNCTION
                        updateRatingCount(logId,friendId);// CALL UPDATE RATING FUNCTION 
                    }
                    else {
                        LOGS.printLogs(req, logId, 3, err);
                        RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
                    }
                });
            });

        }
    });
};

function insertRating(logId, req, res, uid, fid, rating, review, privacy) {
    BIND.ratingModel(uid, fid, rating, review, privacy, function (bindData) {
        var newRating = new RATINGS(bindData);
        newRating.save(function (err, result) {
            if (!err) {
                LOGS.printLogs(req, logId, 1, "Rating process SUCCESS for: " + uid);
                RESP.send(res, true, "Rating Succesfull");
            }
            else {
                LOGS.printLogs(req, logId, 3, err);
                RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
            }
        });
    });
}

// Function for Updating the rating count
function updateRatingCount(logId,fid) {
        USER.findOneAndUpdate({uid:fid},{$inc : {ratingCount:1}}, function (err, result) {
            if (!err) {
                LOGS.printLogs(req, logId, 1, "Rating Count is Updating for: " + fid);
                RESP.send(res, true, "Rating Count update Successfully");
            }
            else {
                LOGS.printLogs(req, logId, 3, err);
                RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
            }
        });
}

// Update user rating
exports.ratingEdit = function (req, res) {
    var logId = LOGS.getlogId();
    LOGS.printClientDataLogs(req, logId);
    LOGS.printLogs(req, logId, 0, "Update Rating start for: " + logId);

    var rating = req.body.rating;
    var ratingId = req.body.ratingId;
    var review = req.body.review;
    var privacy = req.body.privacy;

    BIND.ratingEdit(rating, review, privacy, function (bindData) {
        RATINGS.updateOne({ _id: ratingId }, (bindData), function (err, result) {
            if (!err) {
                LOGS.printLogs(req, logId, 1, "Update rating SUCCESS for: " + uid);
                RESP.send(res, true, "Update Rating Succesfull");
            }
            else {
                LOGS.printLogs(req, logId, 3, err);
                RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
            }
        });
    });
};

// Get user rating
exports.getUserRating = function (req, res) {
    var logId = LOGS.getlogId();
    LOGS.printClientDataLogs(req, logId);
    LOGS.printLogs(req, logId, 0, "Get User rating process start for: " + logId);

    var userId = req.user.userId;

    // getting all the ratings that are received from friends 
    if (userId) {
        RATINGS.findOne({ fid: userId }, function (err, result) {
            if (!err) {
                LOGS.printLogs(req, logId, 1, "Get User rating SUCCESS for: " + ratingId);
                BIND.getUserRating(result, function (respData) {
                    RESP.send(res, true, "Success", null, respData);
                });
            }
            else {
                LOGS.printLogs(req, logId, 3, err);
                RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
            }
        });
    }
    // getting all the ratings that are given by me 
    else if (userId) {
        RATINGS.findOne({ uid: userId }, function (err, result) {
            if (!err) {
                LOGS.printLogs(req, logId, 1, "Get User rating SUCCESS for: " + ratingId);
                BIND.getUserRating(result, function (respData) {
                    RESP.send(res, true, "Success", null, respData);
                });
            }
            else {
                LOGS.printLogs(req, logId, 3, err);
                RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
            }
        });
    }
    // getting all the ratings that are either given by me or received from friends 
    else {
        RATINGS.findOne({ fid: userId }, function (err, result) {
            if (!err) {
                LOGS.printLogs(req, logId, 1, "Get User rating SUCCESS for: " + ratingId);
                BIND.getUserRating(result, function (respData) {
                    RESP.send(res, true, "Success", null, respData);
                });
            }
            else {
                LOGS.printLogs(req, logId, 3, err);
                RESP.send(res, false, err, CONST.ERROR.INTERNAL_SERVER_ERROR);
            }
        });
    }
};