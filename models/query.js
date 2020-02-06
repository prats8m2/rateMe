
const findOne = (COLLECTION, where) => {
    return new Promise(
        (resolve, reject) => {
            COLLECTION.find({ $and: [where] }, function (err, result) {
                if (!err) {
                    resolve(result);
                }
                else {
                    reject(err);
                }
            });
        });
}
exports.findOne = findOne;


const save = (DATA) => {
    return new Promise(
        (resolve, reject) => {
            DATA.save(function (err, result) {
                if (!err) {
                    resolve(result);
                }
                else {
                    reject(err);
                }
            });
        });
}
exports.save = save;