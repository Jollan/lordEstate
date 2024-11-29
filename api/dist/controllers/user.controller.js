"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadChatCount = exports.getUserPosts = exports.savePost = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const customError_1 = __importDefault(require("../lib/error/customError"));
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = (yield prisma_1.default.user.findMany()).map((_a) => {
        var { password } = _a, user = __rest(_a, ["password"]);
        return user;
    });
    res.status(200).json(users);
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id },
    });
    const { password } = user, rest = __rest(user, ["password"]);
    res.status(200).json(rest);
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!req.user.admin && id !== req.user.id) {
        throw new customError_1.default("Not Authorized!", 403);
    }
    const _a = req.body, { password } = _a, inputs = __rest(_a, ["password"]);
    let updatedPassword = "";
    if (password) {
        updatedPassword = yield bcrypt_1.default.hash(password, 10);
    }
    const user = yield prisma_1.default.user.update({
        where: { id },
        data: Object.assign(Object.assign({}, inputs), (updatedPassword && { password: updatedPassword })),
    });
    const { password: pw } = user, rest = __rest(user, ["password"]);
    res.status(200).json(rest);
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!req.user.admin && id !== req.user.id) {
        throw new customError_1.default("Not Authorized!", 403);
    }
    yield prisma_1.default.user.delete({ where: { id } });
    res.status(204).end();
});
exports.deleteUser = deleteUser;
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    const savedPost = yield prisma_1.default.savedPost.findUnique({
        where: {
            userId_postId: {
                userId: req.user.id,
                postId,
            },
        },
    });
    if (savedPost) {
        yield prisma_1.default.savedPost.delete({
            where: { id: savedPost.id, userId: req.user.id },
        });
        res.status(200).json({ message: "Post removed from saved list!" });
    }
    else {
        yield prisma_1.default.savedPost.create({
            data: { userId: req.user.id, postId },
        });
        res.status(200).json({ message: "Post saved!" });
    }
});
exports.savePost = savePost;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userPosts = yield prisma_1.default.post.findMany({
        where: { userId: req.user.id },
        include: { savedPosts: { select: { userId: true } } },
    });
    const saved = yield prisma_1.default.savedPost.findMany({
        where: { userId: req.user.id },
        include: {
            post: { include: { savedPosts: { select: { userId: true } } } },
        },
    });
    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
});
exports.getUserPosts = getUserPosts;
const getUnreadChatCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const number = yield prisma_1.default.chat.count({
        where: {
            userIds: {
                hasSome: [req.user.id],
            },
            NOT: {
                seenBy: {
                    hasSome: [req.user.id],
                },
            },
        },
    });
    res.status(200).json(number);
});
exports.getUnreadChatCount = getUnreadChatCount;
