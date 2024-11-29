import e from "express";
import { getCities } from "../controllers/post.controller";
import __AEH from "../lib/error/asyncErrorHandler";

const cityRouter = e.Router();

cityRouter.get("/", __AEH(getCities));

export = cityRouter;
