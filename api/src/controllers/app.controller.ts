import CustomError from "../lib/error/customError";
import { AsyncRequestHandler } from "../models/root.model";

export const catchAll: AsyncRequestHandler = async (req, res) => {
  throw new CustomError(`Can't find <${req.method} ${req.originalUrl}>!`, 404);
};
