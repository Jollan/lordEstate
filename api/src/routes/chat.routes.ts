import e from "express";
import * as chatController from "../controllers/chat.controller";
import protect from "../middlewares/protect.middleware";
import __AEH from "../lib/error/asyncErrorHandler";

const chatRouter = e.Router();
const __protect = __AEH(protect);

chatRouter
  .route("/")
  .get(__protect, __AEH(chatController.getChats))
  .post(__protect, __AEH(chatController.addChat));
chatRouter.get("/:id", __protect, __AEH(chatController.getChat));
chatRouter.put("/read/:id", __protect, __AEH(chatController.readChat));

export = chatRouter;
