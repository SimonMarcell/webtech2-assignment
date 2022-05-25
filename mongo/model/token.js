const mongoose = require('mongoose'),
    modelName = 'token',
    schemaDefinition = require('../schema/' + modelName),
    schemaInstance = mongoose.Schema(schemaDefinition);

schemaInstance.index({ "refreshTokenExpiresAt": 1 }, { expireAfterSeconds: 0 });

const modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = modelInstance;