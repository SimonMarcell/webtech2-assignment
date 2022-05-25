const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const model = require('../model')
const OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

let Service = require('../service/requestService');
const requestService = new Service();

const mongoUri = 'mongodb://localhost:27017/oauth';

mongoose.connect(mongoUri, {
    useNewUrlParser: true
}, function (err, res) {

    if (err) {
        return console.error('Error connecting to "%s":', mongoUri, err);
    }
    console.log('Connected successfully to "%s"', mongoUri);
});


router.oauth = new OAuth2Server({
    model: require('../model.js'),
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

router.all('/oauth/token', obtainToken);

router.oauth = new OAuth2Server({
    model: require('../model.js'),
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

function obtainToken(req, res) {

    let request = new Request(req);
    let response = new Response(res);

    return router.oauth.token(request, response)
        .then(function (token) {

            res.json(token);
        }).catch(function (err) {

            res.status(err.code || 500).json(err);
        });
}

function authenticateRequest(req, res, next) {

    let request = new Request(req);
    let response = new Response(res);

    return router.oauth.authenticate(request, response)
        .then(function (token) {

            next();
        }).catch(function (err) {

            res.status(err.code || 500).json(err);
        });
}


router.get('/listMeals', (req, res) => {
    if (req.query['_id'] !== undefined) {
        requestService.listMeals(req.query['_id'], (meals) => {
            res.status(200).send(meals);
        });
    } else {
        requestService.listMeals(null, (meal) => {
            res.status(200).send(meal);
        });
    }
});

router.get('/listRestaurants', (req, res) => {
    if (req.query['_id'] !== undefined) {
        requestService.listRestaurants(req.query['_id'], (restaurants) => {
            res.status(200).send(restaurants);
        });
    } else {
        requestService.listRestaurants(null, (restaurant) => {
            res.status(200).send(restaurant);
        });
    }
});

router.post('/addRestaurant', (req, res) => {
    if (!checkRestaurantParams(req, res)) {
        return;
    }

    requestService.addRestaurant(req.body['restaurant'], (success, restaurant) => {
        switch (success) {
            case 1:
                res.status(200).json({
                    msg: `Restaurant successfully added with id: ${restaurant._id}`,
                    restaurant: restaurant
                });
                break;
            case -1:
                res.status(202).json({msg: `Restaurant is already present in the database`});
                break;
            default:
                res.status(500).json({msg: `Internal server error`});
        }
    });
});

function checkRestaurantParams(req, res) {
    if (req.body['restaurant'] === undefined) {
        res.status(400).json({msg: `A restaurant must be defined`});
        return false;
    }
    if (req.body['restaurant']['name'] === undefined || req.body['restaurant']['name'] === "") {
        res.status(400).json({msg: "Restaurant name must be defined"});
        return false;
    }
    if (req.body['restaurant']['location'] === undefined || req.body['restaurant']['location'] === "") {
        res.status(400).json({msg: "Restaurant location must be defined"});
        return false;
    }
    if (req.body['restaurant']['location']['zipCode'] === undefined || req.body['restaurant']['location']['zipCode'] === "") {
        res.status(400).json({msg: "Restaurant location zipCode must be defined"});
        return false;
    }
    if (req.body['restaurant']['location']['country'] === undefined || req.body['restaurant']['location']['country'] === "") {
        res.status(400).json({msg: "Restaurant location country must be defined"});
        return false;
    }
    if (req.body['restaurant']['location']['town'] === undefined || req.body['restaurant']['location']['town'] === "") {
        res.status(400).json({msg: "Restaurant location town must be defined"});
        return false;
    }
    if (req.body['restaurant']['location']['address'] === undefined || req.body['restaurant']['location']['address'] === "") {
        res.status(400).json({msg: "Restaurant location address must be defined"});
        return false;
    }
    return true;
}

router.post('/addMeal', (req, res) => {
    if (!checkMealParams(req, res)) {
        return;
    }

    let meal = {
        "name": req.body['meal']['name'],
        "type": req.body['meal']['type'],
        "calories": req.body['meal']['calories']
    }

    requestService.addMeal(meal, (success, meal) => {
        switch (success) {
            case 1:
                res.status(200).json({msg: `Meal successfully added with id: ${meal._id}`, meal: meal});
                break;
            case -1:
                res.status(202).json({msg: `Meal is already present in the database`});
                break;
            default:
                res.status(500).json({msg: `Internal server error`});
        }
    });
});

router.put('/updateMeal/:id', (req, res) => {

    let request = new Request(req);
    let response = new Response(res);

    return router.oauth.authenticate(request, response)
        .then(function (token) {
            if (!checkMealParams(req, res)) {
                return;
            }

            let meal = {
                "name": req.body['meal']['name'],
                "type": req.body['meal']['type'],
                "calories": req.body['meal']['calories']
            }

            requestService.updateMeal(req.params.id, meal, (result) => {
                switch (result) {
                    case 0:
                        res.status(200).json({msg: `Meal updated with id: ${req.params.id}`});
                        break;
                    case 1:
                        res.status(202).json({msg: `Meal with id: ${req.params.id} already has the requested parameters`});
                        break;
                    case -1:
                        res.status(400).json({msg: `Bad request`});
                }
            });
            // next();
        }).catch(function (err) {

            res.status(err.code || 500).json(err);
        });
});

function checkMealParams(req, res) {
    if (req.body['meal'] === undefined) {
        res.status(400).json({msg: `A meal must be defined`});
        return false;
    }
    if (req.body['meal']['name'] === undefined || req.body['meal']['name'] === "") {
        res.status(400).json({msg: "Meal name must be defined"});
        return false;
    }
    if (req.body['meal']['type'] === undefined || req.body['meal']['type'] === "") {
        res.status(400).json({msg: "Meal type must be defined"});
        return false;
    }
    if (req.body['meal']['calories'] === undefined || req.body['meal']['calories'] === "") {
        res.status(400).json({msg: "Meal calories must be defined"});
        return false;
    }
    return true;
}

router.get('/deleteMeal/:id', (req, res) => {
    requestService.deleteMeal(req.params.id, (success) => {
        switch (success) {
            case 1:
                res.status(200).json({msg: `Meal deleted with id: ${req.params.id}`});
                break;
            case 0:
                res.status(400).json({msg: `Bad request`});
        }
    });
});

router.get('/deleteRestaurant/:id', (req, res) => {
    requestService.deleteRestaurant(req.params.id, (success) => {
        switch (success) {
            case 1:
                res.status(200).json({msg: `Restaurant deleted with id: ${req.params.id}`});
                break;
            case 0:
                res.status(400).json({msg: `Bad request`});
        }
    });
});

router.get('/addMealToRestaurant/:restaurantId/:mealId', (req, res) => {
    requestService.addMealToRestaurant(req.params.restaurantId, req.params.mealId, (success) => {
        if (success) {
            res.status(200).json({
                msg: `Meal added with id: ${req.params.mealId} to restaurant with id: ${req.params.restaurantId}`
            });
        } else {
            res.status(400).json({msg: `Bad request`});
        }
    });
});

router.get('/removeMealFromRestaurant/:restaurantId/:mealId', (req, res) => {
    requestService.removeMealFromRestaurant(req.params.restaurantId, req.params.mealId, (success) => {
        if (success) {
            res.status(200).json({
                msg: `Meal removed with id: ${req.params.mealId}`
                    + ` from restaurant with id: ${req.params.restaurantId}`
            });
        } else {
            res.status(400).json({msg: `Bad request`});
        }
    });
});

router.get('/listMealsFromRestaurant/:restaurantId', (req, res) => {
    requestService.listMealsFromRestaurant(req.params.restaurantId, (result) => {
        if (result === null) {
            res.status(400).json({msg: `Bad request`});
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/listRestaurantsContainingMeal/:mealId', (req, res) => {
    requestService.listRestaurantsContainingMeal(req.params.mealId, (result) => {
        res.status(200).send(result);
    });
});

module.exports = router;
