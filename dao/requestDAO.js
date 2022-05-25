const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const url = 'mongodb://localhost:27017';
const databaseName = 'database';
const mealsCollectionName = 'meals';
const restaurantsCollectionName = 'restaurants';
const usersCollectionName = 'users';

const connection = MongoClient.connect(url);

function readRequests(findParams, callback, collectionName) {
    connection.then(client => client.db(databaseName).collection(collectionName)
        .find(findParams).toArray(function (err, result) {
            callback(result);
        })
    );
}

function listMeals(findParams, callback) {
    let query = null;
    if (findParams !== null) {
        query = {_id: ObjectId(findParams)};
    }
    readRequests(query, (result) => {
        callback(result);
    }, mealsCollectionName);
}

function listRestaurants(findParams, callback) {
    let query = null;
    if (findParams !== null) {
        query = {_id: ObjectId(findParams)};
    }
    readRequests(query, (result) => {
        callback(result);
    }, restaurantsCollectionName);
}

function createUser(request, callback) {
    const userToCheckBeforeAdding = {
        username: request.username
    };

    checkObjectBeforeAdding(userToCheckBeforeAdding, request, usersCollectionName, (result) => {
            callback(result);
        }
    );
}

function addMeal(request, callback) {
    const mealToCheckBeforeAdding = {
        name: request.name,
        type: request.type
    };

    checkObjectBeforeAdding(mealToCheckBeforeAdding, request, mealsCollectionName, (result, meal) => {
            callback(result, meal);
        }
    );
}

function addRestaurant(request, callback) {
    const restaurantToCheckBeforeAdding = {
        name: request.name,
        "location.town": request.location.town
    };

    checkObjectBeforeAdding(restaurantToCheckBeforeAdding, request, restaurantsCollectionName, (result, restaurant) => {
            callback(result, restaurant);
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

function deleteRestaurant(restaurantId, callback) {
    const query = {_id: ObjectId(restaurantId)};

    connection.then(client => client.db(databaseName).collection(restaurantsCollectionName)
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

function updateMeal(mealId, request, callback) {
    const query = {_id: ObjectId(mealId)};

    connection.then(client => client.db(databaseName).collection(mealsCollectionName)
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

function deleteMeal(mealId, callback) {
    const query = {_id: ObjectId(mealId)};

    connection.then(client => client.db(databaseName).collection(mealsCollectionName)
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

function addMealToRestaurant(restaurantId, mealId, callback) {
    connection.then(client => client.db(databaseName).collection(restaurantsCollectionName)
        .findOneAndUpdate({_id: ObjectId(restaurantId)},
            {$addToSet: {availableMeals: ObjectId(mealId)}},
            {},
            (err, result) => {
                if (err) throw err;
                const {ok} = result;
                callback(ok);
            }
        )
    );
}

function removeMealFromRestaurant(restaurantId, mealId, callback) {
    connection.then(client => client.db(databaseName).collection(restaurantsCollectionName)
        .updateOne({_id: ObjectId(restaurantId)},
            {$pull: {availableMeals: ObjectId(mealId)}},
            {},
            (err, result) => {
                if (err) throw err;
                const {modifiedCount} = result;
                callback(modifiedCount);
            })
    );
}

function listMealsFromRestaurant(restaurantId, callback) {
    const query = {_id: ObjectId(restaurantId)};
    readRequests(query, (result) => {
        if (result.length === 0) {
            callback(null);
        } else {
            readRequests({_id: {$in: result[0].availableMeals}}, (result) => {
                callback(result);
            }, mealsCollectionName);
        }
    }, restaurantsCollectionName);
}

function listRestaurantsContainingMeal(mealId, callback) {
    const query = {availableMeals: ObjectId(mealId)};
    readRequests(query, (result) => {
        let resultArray = [];
        result.filter((restaurant) => {
            resultArray.push({_id: restaurant._id, name: restaurant.name});
        });
        callback(resultArray);
    }, restaurantsCollectionName);
}

module.exports = {
    "createUser": createUser,
    "addRestaurant": addRestaurant,
    "addMeal": addMeal,
    "listMeals": listMeals,
    "listRestaurants": listRestaurants,
    "updateMeal": updateMeal,
    "deleteMeal": deleteMeal,
    "deleteRestaurant": deleteRestaurant,
    "addMealToRestaurant": addMealToRestaurant,
    "removeMealFromRestaurant": removeMealFromRestaurant,
    "listMealsFromRestaurant": listMealsFromRestaurant,
    "listRestaurantsContainingMeal": listRestaurantsContainingMeal
};
