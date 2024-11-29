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
exports.getCities = exports.deletePost = exports.updatePost = exports.addPost = exports.getPost = exports.getPosts = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { type, city, minPrice, maxPrice, property, bedroom, page, limit } = req.query;
    [type, city, minPrice, maxPrice, property, bedroom, page, limit] = [
        ...[type, city, minPrice, maxPrice, property, bedroom, page, limit].map((val) => {
            return !val || typeof val !== "string" ? undefined : val.toLowerCase();
        }),
    ];
    const p = +page || 1;
    const take = +limit || 30;
    const skip = (p - 1) * take;
    const count = yield prisma_1.default.post.count();
    const posts = yield prisma_1.default.post.findMany({
        where: {
            city: {
                name: {
                    equals: city,
                    mode: "insensitive",
                },
            },
            type,
            property,
            bedroom: +bedroom || undefined,
            price: {
                gte: +minPrice || undefined,
                lte: +maxPrice || undefined,
            },
        },
        include: {
            city: { select: { name: true } },
            savedPosts: { select: { userId: true } },
        },
        skip,
        take,
    });
    res.status(200).json({ nbPage: Math.ceil(count / take), count, posts });
});
exports.getPosts = getPosts;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const post = yield prisma_1.default.post.findUniqueOrThrow({
        where: { id },
        include: {
            postDetail: true,
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
            savedPosts: { select: { userId: true } },
        },
    });
    res.status(200).json(post);
});
exports.getPost = getPost;
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postData, postDetail } = req.body;
    const { city: name } = postData, inputs = __rest(postData, ["city"]);
    const city = yield findOrCreateCity(name);
    const post = yield prisma_1.default.post.create({
        data: Object.assign(Object.assign(Object.assign({}, inputs), (city && { cityId: city.id })), { userId: req.user.id, postDetail: {
                create: postDetail,
            } }),
    });
    res.status(201).json(post);
});
exports.addPost = addPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postData, postDetail } = req.body;
    const { city: name } = postData, inputs = __rest(postData, ["city"]);
    const id = req.params.id;
    const city = yield findOrCreateCity(name);
    const post = yield prisma_1.default.post.update({
        where: { id, userId: req.user.id },
        data: Object.assign(Object.assign(Object.assign({}, inputs), (city && { cityId: city.id })), { postDetail: { update: postDetail } }),
    });
    res.status(200).json(post);
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield prisma_1.default.post.delete({
        where: { id, userId: req.user.id },
    });
    res.status(204).end();
});
exports.deletePost = deletePost;
const getCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cities = yield prisma_1.default.city.findMany();
    res.status(200).json(cities);
});
exports.getCities = getCities;
function findOrCreateCity(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let city = yield prisma_1.default.city.findFirst({ where: { name } });
        if (name && !city) {
            city = yield prisma_1.default.city.create({ data: { name } });
        }
        return city;
    });
}
