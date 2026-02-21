"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidObjectId = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = require("../errors/AppError");
const errorCodes_1 = require("../errors/errorCodes");
const assertValidObjectId = (id, resourceName) => {
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw new AppError_1.AppError(`${resourceName} id is invalid`, 400, errorCodes_1.ErrorCodes.VALIDATION_ERROR);
    }
};
exports.assertValidObjectId = assertValidObjectId;
//# sourceMappingURL=mongo.js.map