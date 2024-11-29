import e from "express";
import * as postController from "../controllers/post.controller";
import protect from "../middlewares/protect.middleware";
import __AEH from "../lib/error/asyncErrorHandler";

const postRouter = e.Router();
const __protect = __AEH(protect);

postRouter.get("/search", __AEH(postController.getPosts));
postRouter.post("/", __protect, __AEH(postController.addPost));
postRouter
  .route("/:id")
  .get(__AEH(postController.getPost))
  .put(__protect, __AEH(postController.updatePost))
  .delete(__protect, __AEH(postController.deletePost));

export = postRouter;
