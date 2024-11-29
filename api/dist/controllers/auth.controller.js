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
exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../prisma"));
const customError_1 = __importDefault(require("../lib/error/customError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const const_1 = require("../models/const");
const sendTokenResponse = (res, code, user) => {
    const age = 60 * 60 * 24 * 7;
    const token = jsonwebtoken_1.default.sign({ id: user.id, admin: false }, process.env.JWT_SECRET_KEY, {
        expiresIn: age,
    });
    const { password, chatIds, createdAt } = user, rest = __rest(user, ["password", "chatIds", "createdAt"]);
    res
        .cookie("token", token, {
        httpOnly: true,
        secure: const_1.isProdEnv,
        sameSite: const_1.isProdEnv ? "none" : "lax",
        maxAge: age * 1000,
    })
        .status(code)
        .json(rest);
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, avatar, password } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma_1.default.user.create({
        data: {
            username,
            email,
            avatar,
            password: hashedPassword,
        },
    });
    sendTokenResponse(res, 201, user);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { username },
    });
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new customError_1.default("Invalid Credentials!", 400);
    }
    sendTokenResponse(res, 200, user);
});
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("token").status(204).end();
};
exports.logout = logout;
