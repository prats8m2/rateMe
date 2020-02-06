exports.register = function (data, cb) {
    return new Promise(
        (resolve, reject) => {
            resolve({
                'fullName': data.fullName,
                'email': data.email ? data.email : null,
                'password': data.password,
                'gender': data.gender,
                'mobile': data.mobile,
                'created': Date.now(),
                'settings': {
                    'notification': 1
                }
            })
        });
};


exports.login = function (data, cb) {
    cb({
        'password': data.password,
        'mobile': data.mobile
    });
};

exports.loginResp = function (data, token, cb) {
    cb({
        'fullName': data.fullName,
        'email': data.email ? data.email : null,
        'password': data.password,
        'gender': data.gender,
        'mobile': data.mobile,
        'token': token
    });
}

exports.getUserResp = function (data, cb) {
    cb(data);
}


exports.registerViaRating = function (mobile, cb) {
    cb({
        'fullName': "RateMe User",
        'email': null,
        'password': "1111",
        'gender': "M",
        'mobile': mobile,
        'created': Date.now(),
        'settings': {
            'notification': 1
        }
    })
}

exports.ratingModel = function (uid, fid, rating, review, privacy, cb) {
    cb({
        'uid': uid,
        'fid': fid,
        'rating1': rating[0],
        'rating2': rating[1],
        'rating3': rating[2],
        'rating4': rating[3],
        'rating5': rating[4],
        'privacy': privacy,
        'status': 1,
        'comments': [{
            'comment': review
        }]
    })
}

exports.ratingEdit = function (rating, review, privacy, cb) {
    cb({
        'rating1': rating[0],
        'rating2': rating[1],
        'rating3': rating[2],
        'rating4': rating[3],
        'rating5': rating[4],
        'privacy': privacy,
        'comments': [{
            'comment': review
        }]
    })
}

exports.getUserRating = function (data, cb) {
    cb(data);
}
