var jwt = require('jsonwebtoken');
const RESP = require('../services/resp');
const LOGS = require('../services/logs');
const USER = require('../controllers/user');



module.exports.route = function (app) {

    app.post('/reg', USER.register);
    app.post('/login', USER.login);
    app.get('/user',authenticate, USER.getUser);
};

function authenticate(req,res,next){
    var logId  = LOGS.getlogId();
    if(req.query.token || req.body.token){
        let token  = req.query.token ? req.query.token : req.body.token;
        LOGS.printLogs(req,logId,0,"Authentication process starts for: "+token);
        jwt.verify(token, 'Shhhh', function(err, decoded) {
            if(!err){
                LOGS.printLogs(req,logId,1,"Authentication process Success for: "+decoded.userId);
                req.user = {};
                req.user.userId = decoded.userId;
                next();
            }
            else{
                LOGS.printLogs(req,logId,3,"Authentication token Invalid: "+token);
                RESP.send(res,false,"Invalid Token",9001);        
            }
          });
    }
    else{
        LOGS.printLogs(req,logId,1,"Authentication token missing");
        RESP.send(res,false,"Missing Token",9000);
    }
}