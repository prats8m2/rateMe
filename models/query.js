
const findOne = (COLLECTION, where) => {
    return new Promise(
        (resolve, reject) => {
            COLLECTION.find({ $and: [where] }, function (err, result) {
                if (!err) {
                    resolve(result[0]);
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

const saveMany = (COLLECTION,DATA) => {
    return new Promise(
        (resolve, reject) => {
            COLLECTION.create(DATA,function (err, result) {
                if (!err) {
                    resolve(result);
                }
                else {
                    reject(err);
                }
            });
        });
}
exports.saveMany = saveMany;

const updateOne = (COLLECTION,WHERE,DATA) => {
    return new Promise(
        (resolve, reject) => {
            COLLECTION.updateOne(WHERE,DATA,function (err, result) {
                if (!err) {
                    resolve(result);
                }
                else {
                    reject(err);
                }
            });
        });
}
exports.updateOne = updateOne;