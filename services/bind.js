exports.register = function (data,cb) {
    cb({
        'fullName' : data.fullName, 
        'email' : data.email ? data.email : null,
        'password' : data.password,
        'gender' : data.gender,
        'mobile' : data.mobile,
        'created' : Date.now(),
        'settings':{
            'notification' : 1
        }
    });
 };


 exports.login = function (data,cb) {
    cb({
        'password' : data.password,
        'mobile' : data.mobile
    });
 };

 exports.loginResp = function(data,token,cb){
     cb({
        'fullName' : data.fullName,
        'email' : data.email ? data.email : null,
        'password' : data.password,
        'gender' : data.gender,
        'mobile' : data.mobile,
        'token' : token
     });
 }

 exports.getUserResp = function(data,cb){
     cb(data);
 }