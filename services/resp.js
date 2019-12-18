exports.send = function (res,status,msg,err,data) {
    var response = {
        'status' : status,
        'message' : msg,
        'err' : err ? err : null,
        'data': data ? data : null
    };
    res.send(response);
 };