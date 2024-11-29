import e from "express";
import * as authController from "../controllers/auth.controller";
import __AEH from "../lib/error/asyncErrorHandler";

const authRouter = e.Router();

authRouter.post("/register", __AEH(authController.register));
authRouter.post("/login", __AEH(authController.login));
authRouter.post("/logout", authController.logout);

export = authRouter;
