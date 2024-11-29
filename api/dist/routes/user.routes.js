"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("../controllers/user.controller"));
const protect_middleware_1 = __importDefault(require("../middlewares/protect.middleware"));
const asyncErrorHandler_1 = __importDefault(require("../lib/error/asyncErrorHandler"));
const userRouter = express_1.default.Router();
const __protect = (0, asyncErrorHandler_1.default)(protect_middleware_1.default);
userRouter.get("/", (0, asyncErrorHandler_1.default)(userController.getUsers));
userRouter.get("/chats/unread", __protect, (0, asyncErrorHandler_1.default)(userController.getUnreadChatCount));
userRouter.get("/posts", __protect, (0, asyncErrorHandler_1.default)(userController.getUserPosts));
userRouter.post("/savePost", __protect, (0, asyncErrorHandler_1.default)(userController.savePost));
userRouter
    .route("/:id")
    .get((0, asyncErrorHandler_1.default)(userController.getUser))
    .put(__protect, (0, asyncErrorHandler_1.default)(userController.updateUser))
    .delete(__protect, (0, asyncErrorHandler_1.default)(userController.deleteUser));
module.exports = userRouter;
