"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const asyncErrorHandler_1 = __importDefault(require("../lib/error/asyncErrorHandler"));
const cityRouter = express_1.default.Router();
cityRouter.get("/", (0, asyncErrorHandler_1.default)(post_controller_1.getCities));
module.exports = cityRouter;
