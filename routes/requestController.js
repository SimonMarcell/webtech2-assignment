const express = require('express');
const router = express.Router();

let Service = require('../service/requestService');
const requestService = new Service();

router.get('/listPhones', (req, res) => {
    if (req.query['_id'] !== undefined) {
        requestService.listPhones(req.query['_id'], (phones) => {
            res.status(200).send(phones);
        });
    } else {
        requestService.listPhones(null, (phone) => {
            res.status(200).send(phone);
        });
    }
});

router.get('/listStores', (req, res) => {
    if (req.query['_id'] !== undefined) {
        requestService.listStores(req.query['_id'], (stores) => {
            res.status(200).send(stores);
        });
    } else {
        requestService.listStores(null, (store) => {
            res.status(200).send(store);
        });
    }
});

router.post('/addStore', (req, res) => {
    if (!checkStoreParams(req, res)) {
        return;
    }

    requestService.addStore(req.body['store'], (success, store) => {
        switch (success) {
            case 1:
                res.status(200).json({msg: `Store successfully added with id: ${store._id}`, store: store});
                break;
            case -1:
                res.status(202).json({msg: `Store is already present in the database`});
                break;
            default:
                res.status(500).json({msg: `Internal server error`});
        }
    });
});

function checkStoreParams(req, res) {
    if (req.body['store'] === undefined) {
        res.status(400).json({msg: `A store must be defined`});
        return false;
    }
    if (req.body['store']['name'] === undefined || req.body['store']['name'] === "") {
        res.status(400).json({msg: "Store name must be defined"});
        return false;
    }
    if (req.body['store']['location'] === undefined || req.body['store']['location'] === "") {
        res.status(400).json({msg: "Store location must be defined"});
        return false;
    }
    if (req.body['store']['location']['zipCode'] === undefined || req.body['store']['location']['zipCode'] === "") {
        res.status(400).json({msg: "Store location zipCode must be defined"});
        return false;
    }
    if (req.body['store']['location']['country'] === undefined || req.body['store']['location']['country'] === "") {
        res.status(400).json({msg: "Store location country must be defined"});
        return false;
    }
    if (req.body['store']['location']['town'] === undefined || req.body['store']['location']['town'] === "") {
        res.status(400).json({msg: "Store location town must be defined"});
        return false;
    }
    if (req.body['store']['location']['address'] === undefined || req.body['store']['location']['address'] === "") {
        res.status(400).json({msg: "Store location address must be defined"});
        return false;
    }
    if (req.body['store']['rating'] === undefined || req.body['store']['rating'] === "") {
        res.status(400).json({msg: "Store rating must be defined"});
        return false;
    }
    return true;
}

router.post('/addPhone', (req, res) => {
    if (!checkPhoneParams(req, res)) {
        return;
    }

    requestService.addPhone(req.body['phone'], (success, phone) => {
        switch (success) {
            case 1:
                res.status(200).json({msg: `Phone successfully added with id: ${phone._id}`, phone: phone});
                break;
            case -1:
                res.status(202).json({msg: `Phone is already present in the database`});
                break;
            default:
                res.status(500).json({msg: `Internal server error`});
        }
    });
});

router.put('/updatePhone/:id', (req, res) => {
    if (!checkPhoneParams(req, res)) {
        return;
    }

    requestService.updatePhone(req.params.id, req.body['phone'], (result) => {
        switch (result) {
            case 0:
                res.status(200).json({msg: `Phone updated with id: ${req.params.id}`});
                break;
            case 1:
                res.status(202).json({msg: `Phone with id: ${req.params.id} already has the requested parameters`});
                break;
            case -1:
                res.status(400).json({msg: `Bad request`});
        }
    });
});

function checkPhoneParams(req, res) {
    if (req.body['phone'] === undefined) {
        res.status(400).json({msg: `A phone must be defined`});
        return false;
    }
    if (req.body['phone']['manufacturer'] === undefined || req.body['phone']['manufacturer'] === "") {
        res.status(400).json({msg: "Phone manufacturer must be defined"});
        return false;
    }
    if (req.body['phone']['model'] === undefined || req.body['phone']['model'] === "") {
        res.status(400).json({msg: "Phone manufacturer must be defined"});
        return false;
    }
    if (req.body['phone']['price'] === undefined || req.body['phone']['price'] === "") {
        res.status(400).json({msg: "Phone manufacturer must be defined"});
        return false;
    }
    if (req.body['phone']['displayType'] === undefined || req.body['phone']['displayType'] === "") {
        res.status(400).json({msg: "Phone manufacturer must be defined"});
        return false;
    }
    if (req.body['phone']['displaySize'] === undefined || req.body['phone']['displaySize'] === "") {
        res.status(400).json({msg: "Phone manufacturer must be defined"});
        return false;
    }
    return true;
}

router.get('/deletePhone/:id', (req, res) => {
    requestService.deletePhone(req.params.id, (success) => {
        switch (success) {
            case 1:
                res.status(200).json({msg: `Phone deleted with id: ${req.params.id}`});
                break;
            case 0:
                res.status(400).json({msg: `Bad request`});
        }
    });
});

router.get('/deleteStore/:id', (req, res) => {
    requestService.deleteStore(req.params.id, (success) => {
        switch (success) {
            case 1:
                res.status(200).json({msg: `Store deleted with id: ${req.params.id}`});
                break;
            case 0:
                res.status(400).json({msg: `Bad request`});
        }
    });
});

router.get('/addPhoneToStore/:storeId/:phoneId', (req, res) => {
    requestService.addPhoneToStore(req.params.storeId, req.params.phoneId, (success) => {
        if (success) {
            res.status(200).json({
                msg: `Phone added with id: ${req.params.phoneId} to store with id: ${req.params.storeId}`
            });
        } else {
            res.status(400).json({msg: `Bad request`});
        }
    });
});

router.get('/removePhoneFromStore/:storeId/:phoneId', (req, res) => {
    requestService.removePhoneFromStore(req.params.storeId, req.params.phoneId, (success) => {
        if (success) {
            res.status(200).json({
                msg: `Phone removed with id: ${req.params.phoneId}`
                    + ` from store with id: ${req.params.storeId}`
            });
        } else {
            res.status(400).json({msg: `Bad request`});
        }
    });
});

router.get('/listPhonesFromStore/:storeId', (req, res) => {
    requestService.listPhonesFromStore(req.params.storeId, (result) => {
        if (result === null) {
            res.status(400).json({msg: `Bad request`});
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/listStoresContainingPhone/:phoneId', (req, res) => {
    requestService.listStoresContainingPhone(req.params.phoneId, (result) => {
        res.status(200).send(result);
    });
});

module.exports = router;
