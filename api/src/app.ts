import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import globalErrorHandler from "./controllers/error.controller";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import __AEH from "./lib/error/asyncErrorHandler";
import { catchAll } from "./controllers/app.controller";
import chatRouter from "./routes/chat.routes";
import messageRouter from "./routes/message.routes";
import cityRouter from "./routes/city.routes";
import http from "http";
import { Server } from "socket.io";
import ioFlow from "./socket";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL },
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/v1/authen", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/cities", cityRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);
app.use("*", __AEH(catchAll));

app.use(globalErrorHandler);

ioFlow(io);

export = server;
