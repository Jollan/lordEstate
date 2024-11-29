import e from "express";
import { AsyncRequestHandler } from "../../models/root.model";
import CustomError from "./customError";
import { isProdEnv } from "../../models/const";
import { last } from "lodash";

const errorMap: {
  [key: string]: (error: any, origin: string) => [string, number];
} = {
  ["NotFoundError"](error) {
    const message = error.message;
    return [message, 404];
  },
  ["PrismaClientKnownRequestError"](error) {
    let message = "";
    if (error.code === "P2002") {
      message = `This ${error.meta.target.split("_")[1]} is already taken.`;
    }
    if (error.code === "P2010") {
      message = error.meta.message;
    }
    return [message, 400];
  },
  ["PrismaClientValidationError"](error) {
    const message = last(error.message.split("\n\n")) as string;
    return [message, 400];
  },
  ["JsonWebTokenError"](error) {
    const message = "Invalid token! Please try again later.";
    return [message, 400];
  },
  ["TokenExpiredError"](error) {
    const message = "Token has expired! Please try again later.";
    return [message, 400];
  },
  ["genericError"](error) {
    const message = "Something went wrong! Please try again later.";
    return [message, 500];
  },
};

function asyncErrorHandler(fn: AsyncRequestHandler): e.RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (isProdEnv && !(error instanceof CustomError)) {
        let errorName = error.name;
        errorName = errorName in errorMap ? errorName : "genericError";
        error = new CustomError(...errorMap[errorName](error, fn.name));
      }
      next(error);
    });
  };
}

export = asyncErrorHandler;
