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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readChat = exports.addChat = exports.getChat = exports.getChats = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield prisma_1.default.chat.findMany({
        where: {
            userIds: {
                hasSome: [req.user.id],
            },
        },
        include: {
            users: { select: { id: true, username: true, avatar: true } },
        },
        orderBy: { updatedAt: "desc" },
    });
    res.status(200).json(chats);
});
exports.getChats = getChats;
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield prisma_1.default.chat.update({
        where: {
            id: req.params.id,
            userIds: {
                hasSome: [req.user.id],
            },
        },
        data: {
            seenBy: {
                push: [req.user.id],
            },
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
    res.status(200).json(chat);
});
exports.getChat = getChat;
const addChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield prisma_1.default.chat.create({
        data: {
            userIds: [req.user.id, req.body.correspondentId],
            seenBy: [req.user.id, req.body.correspondentId],
        },
        include: {
            users: { select: { id: true, username: true, avatar: true } },
        },
    });
    res.status(201).json(chat);
});
exports.addChat = addChat;
const readChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield prisma_1.default.chat.update({
        where: {
            id: req.params.id,
            userIds: {
                hasSome: [req.user.id],
            },
        },
        data: {
            seenBy: {
                push: [req.user.id],
            },
        },
    });
    res.status(200).json(chat);
});
exports.readChat = readChat;
