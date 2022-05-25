function RequestService(requestDAO) {
    if (requestDAO !== undefined) {
        this.requestDAO = requestDAO;
    } else {
        this.requestDAO = require('../dao/requestDAO');
    }
}

RequestService.prototype.createUser = function (request, callback) {
    this.requestDAO.createUser(request, (success) => {
        callback(success);
    });
};

RequestService.prototype.addMeal = function (request, callback) {
    this.requestDAO.addMeal(request, (success, meal) => {
        callback(success, meal);
    });
};

RequestService.prototype.listMeals = function (findParams, callback) {
    this.requestDAO.listMeals(findParams, (meals) => {
        callback(meals);
    });
};

RequestService.prototype.addRestaurant = function (request, callback) {
    this.requestDAO.addRestaurant(request, (success, restaurant) => {
        callback(success, restaurant);
    });
};

RequestService.prototype.listRestaurants = function (findParams, callback) {
    this.requestDAO.listRestaurants(findParams, (restaurants) => {
        callback(restaurants);
    });
};

RequestService.prototype.updateMeal = function (mealId, request, callback) {
    this.requestDAO.updateMeal(mealId, request, (result) => {
        callback(result);
    });
};

RequestService.prototype.deleteMeal = function (mealId, callback) {
    this.requestDAO.deleteMeal(mealId, (success) => {
        callback(success);
    });
};

RequestService.prototype.deleteRestaurant = function (restaurantId, callback) {
    this.requestDAO.deleteRestaurant(restaurantId, (success) => {
        callback(success);
    });
};

RequestService.prototype.addMealToRestaurant = function (restaurantId, mealId, callback) {
    this.requestDAO.addMealToRestaurant(restaurantId, mealId, (success) => {
        callback(success);
    });
};

RequestService.prototype.removeMealFromRestaurant = function (restaurantId, mealId, callback) {
    this.requestDAO.removeMealFromRestaurant(restaurantId, mealId, (success) => {
        callback(success);
    });
};

RequestService.prototype.listMealsFromRestaurant = function (restaurantId, callback) {
    this.requestDAO.listMealsFromRestaurant(restaurantId, (success) => {
        callback(success);
    });
};

RequestService.prototype.listRestaurantsContainingMeal = function (mealId, callback) {
    this.requestDAO.listRestaurantsContainingMeal(mealId, (success) => {
        callback(success);
    });
};

module.exports = RequestService;
