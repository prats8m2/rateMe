exports.send = function (res,status,msg,err,data) {
    var response = {
        'status' : status,
        'message' : msg ? (msg.message ? msg.message : msg) : null,
        'err' : err ? (err.message ? err.message : err) : null,
        'data': data ? data : null
    };
    res.send(response);
 };