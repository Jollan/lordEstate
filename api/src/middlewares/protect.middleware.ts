import CustomError from "../lib/error/customError";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { AsyncRequestHandler } from "../models/root.model";

const protect: AsyncRequestHandler = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new CustomError("Access denied. No token provided!", 401);
  }
  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY!
  ) as jwt.JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: payload.id },
  });

  req.user = { ...user, admin: payload.admin };
  next();
};

export = protect;
