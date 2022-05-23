function RequestService(requestDAO) {
    if (requestDAO !== undefined) {
        this.requestDAO = requestDAO;
    } else {
        this.requestDAO = require('../dao/requestDAO');
    }
}

RequestService.prototype.addPhone = function (request, callback) {
    this.requestDAO.addPhone(request, (success, phone) => {
        callback(success, phone);
    });
};

RequestService.prototype.listPhones = function (findParams, callback) {
    this.requestDAO.listPhones(findParams, (phones) => {
        callback(phones);
    });
};

RequestService.prototype.addStore = function (request, callback) {
    this.requestDAO.addStore(request, (success, store) => {
        callback(success, store);
    });
};

RequestService.prototype.listStores = function (findParams, callback) {
    this.requestDAO.listStores(findParams, (stores) => {
        callback(stores);
    });
};

RequestService.prototype.updatePhone = function (phoneId, request, callback) {
    this.requestDAO.updatePhone(phoneId, request, (result) => {
        callback(result);
    });
};

RequestService.prototype.deletePhone = function (phoneId, callback) {
    this.requestDAO.deletePhone(phoneId, (success) => {
        callback(success);
    });
};

RequestService.prototype.deleteStore = function (storeId, callback) {
    this.requestDAO.deleteStore(storeId, (success) => {
        callback(success);
    });
};

RequestService.prototype.addPhoneToStore = function (storeId, phoneId, callback) {
    this.requestDAO.addPhoneToStore(storeId, phoneId, (success) => {
        callback(success);
    });
};

RequestService.prototype.removePhoneFromStore = function (storeId, phoneId, callback) {
    this.requestDAO.removePhoneFromStore(storeId, phoneId, (success) => {
        callback(success);
    });
};

RequestService.prototype.listPhonesFromStore = function (storeId, callback) {
    this.requestDAO.listPhonesFromStore(storeId, (success) => {
        callback(success);
    });
};

RequestService.prototype.listStoresContainingPhone = function (phoneId, callback) {
    this.requestDAO.listStoresContainingPhone(phoneId, (success) => {
        callback(success);
    });
};

module.exports = RequestService;
