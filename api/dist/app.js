"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const error_controller_1 = __importDefault(require("./controllers/error.controller"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const asyncErrorHandler_1 = __importDefault(require("./lib/error/asyncErrorHandler"));
const app_controller_1 = require("./controllers/app.controller");
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const city_routes_1 = __importDefault(require("./routes/city.routes"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./socket"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: process.env.CLIENT_URL },
});
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1/authen", auth_routes_1.default);
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/posts", post_routes_1.default);
app.use("/api/v1/cities", city_routes_1.default);
app.use("/api/v1/chats", chat_routes_1.default);
app.use("/api/v1/messages", message_routes_1.default);
app.use("*", (0, asyncErrorHandler_1.default)(app_controller_1.catchAll));
app.use(error_controller_1.default);
(0, socket_1.default)(io);
module.exports = server;
