const USER = require('../models/user');
const SMS = require('../models/sms');
const LOGS = require('../services/logs');
const BIND = require('../services/bind');
const RESP = require('../services/resp');
const CONST = require('../constant');
var jwt = require('jsonwebtoken');

exports.sms = function (uid, logId) {
	// LOGS.printLogs(req,logId,0,"Registration process starts for: "+req.body.firstName+" "+req.body.lastName);
	SMS.findOne({ uid: uid }, { count: { $exists: true } }, function (err, result) {
		if (!err) {
			if (result.count <= 3 || result.count % 2 == 1) {
				console.log("Sendind SMS");
				let count = result.count + 1;
				SMS.updateOne({ uid: result[uid] }, { $set: { count: count } }, function (err, res) {
					if (err) throw err;
					console.log("Count is Update");
				});
			}
		}
		else {
			SMS.insetOne({ uid: uid }, { count: 1 }, function (err, res) {
				console.log("After instering : Sending SMS");
				if (err) throw err;
				console.log("Id is inserted");
			});
		}
	});
}

exports.generateOTP = function(){
	return Math.floor(Math.random() * 9999) + 1000;
}
