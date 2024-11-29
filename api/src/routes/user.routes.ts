import e from "express";
import * as userController from "../controllers/user.controller";
import protect from "../middlewares/protect.middleware";
import __AEH from "../lib/error/asyncErrorHandler";

const userRouter = e.Router();
const __protect = __AEH(protect);

userRouter.get("/", __AEH(userController.getUsers));
userRouter.get("/chats/unread",__protect, __AEH(userController.getUnreadChatCount));
userRouter.get("/posts", __protect, __AEH(userController.getUserPosts));
userRouter.post("/savePost", __protect, __AEH(userController.savePost));
userRouter
  .route("/:id")
  .get(__AEH(userController.getUser))
  .put(__protect, __AEH(userController.updateUser))
  .delete(__protect, __AEH(userController.deleteUser));

export = userRouter;
