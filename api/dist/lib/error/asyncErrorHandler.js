"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const customError_1 = __importDefault(require("./customError"));
const const_1 = require("../../models/const");
const lodash_1 = require("lodash");
const errorMap = {
    ["NotFoundError"](error) {
        const message = error.message;
        return [message, 404];
    },
    ["PrismaClientKnownRequestError"](error) {
        let message = "";
        if (error.code === "P2002") {
            message = `This ${error.meta.target.split("_")[1]} is already taken.`;
        }
        if (error.code === "P2010") {
            message = error.meta.message;
        }
        return [message, 400];
    },
    ["PrismaClientValidationError"](error) {
        const message = (0, lodash_1.last)(error.message.split("\n\n"));
        return [message, 400];
    },
    ["JsonWebTokenError"](error) {
        const message = "Invalid token! Please try again later.";
        return [message, 400];
    },
    ["TokenExpiredError"](error) {
        const message = "Token has expired! Please try again later.";
        return [message, 400];
    },
    ["genericError"](error) {
        const message = "Something went wrong! Please try again later.";
        return [message, 500];
    },
};
function asyncErrorHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            if (const_1.isProdEnv && !(error instanceof customError_1.default)) {
                let errorName = error.name;
                errorName = errorName in errorMap ? errorName : "genericError";
                error = new customError_1.default(...errorMap[errorName](error, fn.name));
            }
            next(error);
        });
    };
}
module.exports = asyncErrorHandler;
