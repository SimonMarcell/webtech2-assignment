const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const url = 'mongodb://localhost:27017';
const databaseName = 'phonedatabase';
const phonesCollectionName = 'phones';
const storesCollectionName = 'stores';

const connection = MongoClient.connect(url);

function readRequests(findParams, callback, collectionName) {
    connection.then(client => client.db(databaseName).collection(collectionName)
        .find(findParams).toArray(function (err, result) {
            callback(result);
        })
    );
}

function listPhones(findParams, callback) {
    let query = null;
    if (findParams !== null) {
        query = {_id: ObjectId(findParams)};
    }
    readRequests(query, (result) => {
        callback(result);
    }, phonesCollectionName);
}

function listStores(findParams, callback) {
    let query = null;
    if (findParams !== null) {
        query = {_id: ObjectId(findParams)};
    }
    readRequests(query, (result) => {
        callback(result);
    }, storesCollectionName);
}

function addPhone(request, callback) {
    const phoneToCheckBeforeAdding = {
        manufacturer: request.manufacturer,
        model: request.model
    };

    checkObjectBeforeAdding(phoneToCheckBeforeAdding, request, phonesCollectionName, (result, phone) => {
            callback(result, phone);
        }
    );
}

function addStore(request, callback) {
    const storeToCheckBeforeAdding = {
        name: request.name,
        "location.town": request.location.town
    };

    checkObjectBeforeAdding(storeToCheckBeforeAdding, request, storesCollectionName, (result, store) => {
            callback(result, store);
        }
    );
}

function checkObjectBeforeAdding(objectToCheck, request, collection, callback) {
    readRequests(objectToCheck, (result) => {
        if (result.length === 0) {
            connection.then(client => client.db(databaseName).collection(collection)
                .insertOne(request, (err, result) => {
                    if (err) {
                        callback();
                    } else {
                        callback(result.insertedCount, result.ops[0]);
                    }
                })
            );
        } else {
            callback(-1);
        }
    }, collection);
}

function deleteStore(storeId, callback) {
    const query = {_id: ObjectId(storeId)};

    connection.then(client => client.db(databaseName).collection(storesCollectionName)
        .deleteOne(query, (err, result) => {
            if (err) throw err;
            const {deletedCount} = result;
            if (deletedCount) {
                callback(1);
            } else {
                callback(0);
            }
        })
    );
}

function updatePhone(phoneId, request, callback) {
    const query = {_id: ObjectId(phoneId)};

    connection.then(client => client.db(databaseName).collection(phonesCollectionName)
        .updateOne(query, {$set: request}, (err, result) => {
            if (err) throw err;
            let {matchedCount, modifiedCount} = result;
            if (matchedCount && modifiedCount) {
                callback(0);
            } else if (matchedCount || modifiedCount) {
                callback(1);
            } else {
                callback(-1);
            }
        })
    );
}

function deletePhone(phoneId, callback) {
    const query = {_id: ObjectId(phoneId)};

    connection.then(client => client.db(databaseName).collection(phonesCollectionName)
        .deleteOne(query, (err, result) => {
            if (err) throw err;
            const {deletedCount} = result;
            if (deletedCount) {
                callback(1);
            } else {
                callback(0);
            }
        })
    );
}

function addPhoneToStore(storeId, phoneId, callback) {
    connection.then(client => client.db(databaseName).collection(storesCollectionName)
        .findOneAndUpdate({_id: ObjectId(storeId)},
            {$addToSet: {availablePhones: ObjectId(phoneId)}},
            {},
            (err, result) => {
                if (err) throw err;
                const {ok} = result;
                callback(ok);
            }
        )
    );
}

function removePhoneFromStore(storeId, phoneId, callback) {
    connection.then(client => client.db(databaseName).collection(storesCollectionName)
        .updateOne({_id: ObjectId(storeId)},
            {$pull: {availablePhones: ObjectId(phoneId)}},
            {},
            (err, result) => {
                if (err) throw err;
                const {modifiedCount} = result;
                callback(modifiedCount);
            })
    );
}

function listPhonesFromStore(storeId, callback) {
    const query = {_id: ObjectId(storeId)};
    readRequests(query, (result) => {
        if (result.length === 0) {
            callback(null);
        } else {
            readRequests({_id: {$in: result[0].availablePhones}}, (result) => {
                callback(result);
            }, phonesCollectionName);
        }
    }, storesCollectionName);
}

function listStoresContainingPhone(phoneId, callback) {
    const query = {availablePhones: ObjectId(phoneId)};
    readRequests(query, (result) => {
        let resultArray = [];
        result.filter((store) => {
            resultArray.push({_id: store._id, name: store.name});
        });
        callback(resultArray);
    }, storesCollectionName);
}

module.exports = {
    "addStore": addStore,
    "addPhone": addPhone,
    "listPhones": listPhones,
    "listStores": listStores,
    "updatePhone": updatePhone,
    "deletePhone": deletePhone,
    "deleteStore": deleteStore,
    "addPhoneToStore": addPhoneToStore,
    "removePhoneFromStore": removePhoneFromStore,
    "listPhonesFromStore": listPhonesFromStore,
    "listStoresContainingPhone": listStoresContainingPhone
};
