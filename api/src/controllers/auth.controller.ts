import e from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma";
import CustomError from "../lib/error/customError";
import jwt from "jsonwebtoken";
import { isProdEnv } from "../models/const";
import { User } from "@prisma/client";
import { AsyncRequestHandler } from "../models/root.model";

const sendTokenResponse = (res: e.Response, code: number, user: User) => {
  const age = 60 * 60 * 24 * 7;

  const token = jwt.sign(
    { id: user.id, admin: false },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: age,
    }
  );

  const { password, chatIds, createdAt, ...rest } = user;

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: isProdEnv,
      sameSite: isProdEnv ? "none" : "lax",
      maxAge: age * 1000,
    })
    .status(code)
    .json(rest);
};

export const register: AsyncRequestHandler = async (req, res) => {
  const { username, email, avatar, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      avatar,
      password: hashedPassword,
    },
  });

  sendTokenResponse(res, 201, user);
};

export const login: AsyncRequestHandler = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUniqueOrThrow({
    where: { username },
  });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new CustomError("Invalid Credentials!", 400);
  }

  sendTokenResponse(res, 200, user);
};

export const logout: e.RequestHandler = (req, res) => {
  res.clearCookie("token").status(204).end();
};
