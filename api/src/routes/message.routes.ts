import e from "express";
import * as messageController from "../controllers/message.controller";
import protect from "../middlewares/protect.middleware";
import __AEH from "../lib/error/asyncErrorHandler";

const messageRouter = e.Router();
const __protect = __AEH(protect);

messageRouter.post("/:chatId", __protect, __AEH(messageController.addMessage));
messageRouter.put(
  "/read/:chatId/:id",
  __protect,
  __AEH(messageController.readMessage)
);

export = messageRouter;
