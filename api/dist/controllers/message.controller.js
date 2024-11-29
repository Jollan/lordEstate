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
exports.readMessage = exports.addMessage = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = req.params.chatId;
    const text = req.body.text;
    yield prisma_1.default.chat.update({
        where: {
            id: chatId,
            userIds: {
                hasSome: [req.user.id],
            },
        },
        data: {
            seenBy: [req.user.id],
            lastMessage: text,
            updatedAt: Date.now(),
        },
    });
    const message = yield prisma_1.default.message.create({
        data: {
            text,
            chatId,
            senderId: req.user.id,
        },
        include: {
            chat: {
                include: {
                    users: { select: { id: true, username: true, avatar: true } },
                },
            },
        },
    });
    res.status(201).json(message);
});
exports.addMessage = addMessage;
const readMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield prisma_1.default.message.update({
        where: {
            chatId: req.params.chatId,
            id: req.params.id,
        },
        data: { read: true },
    });
    res.status(200).json(message);
});
exports.readMessage = readMessage;
