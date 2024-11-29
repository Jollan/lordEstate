import CustomError from "../lib/error/customError";
import { AsyncRequestHandler } from "../models/root.model";
import prisma from "../prisma";
import bcrypt from "bcrypt";

export const getUsers: AsyncRequestHandler = async (req, res) => {
  const users = (await prisma.user.findMany()).map(
    ({ password, ...user }) => user
  );
  res.status(200).json(users);
};

export const getUser: AsyncRequestHandler = async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  const { password, ...rest } = user;

  res.status(200).json(rest);
};

export const updateUser: AsyncRequestHandler = async (req, res) => {
  const id = req.params.id;

  if (!req.user!.admin && id !== req.user!.id) {
    throw new CustomError("Not Authorized!", 403);
  }

  const { password, ...inputs } = req.body;

  let updatedPassword = "";
  if (password) {
    updatedPassword = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...inputs,
      ...(updatedPassword && { password: updatedPassword }),
    },
  });
  const { password: pw, ...rest } = user;

  res.status(200).json(rest);
};

export const deleteUser: AsyncRequestHandler = async (req, res) => {
  const id = req.params.id;

  if (!req.user!.admin && id !== req.user!.id) {
    throw new CustomError("Not Authorized!", 403);
  }

  await prisma.user.delete({ where: { id } });

  res.status(204).end();
};

export const savePost: AsyncRequestHandler = async (req, res) => {
  const { postId } = req.body;

  const savedPost = await prisma.savedPost.findUnique({
    where: {
      userId_postId: {
        userId: req.user!.id,
        postId,
      },
    },
  });

  if (savedPost) {
    await prisma.savedPost.delete({
      where: { id: savedPost.id, userId: req.user!.id },
    });

    res.status(200).json({ message: "Post removed from saved list!" });
  } else {
    await prisma.savedPost.create({
      data: { userId: req.user!.id, postId },
    });

    res.status(200).json({ message: "Post saved!" });
  }
};

export const getUserPosts: AsyncRequestHandler = async (req, res) => {
  const userPosts = await prisma.post.findMany({
    where: { userId: req.user!.id },
    include: { savedPosts: { select: { userId: true } } },
  });

  const saved = await prisma.savedPost.findMany({
    where: { userId: req.user!.id },
    include: {
      post: { include: { savedPosts: { select: { userId: true } } } },
    },
  });
  const savedPosts = saved.map((item) => item.post);

  res.status(200).json({ userPosts, savedPosts });
};

export const getUnreadChatCount: AsyncRequestHandler = async (req, res) => {
  const number = await prisma.chat.count({
    where: {
      userIds: {
        hasSome: [req.user!.id],
      },
      NOT: {
        seenBy: {
          hasSome: [req.user!.id],
        },
      },
    },
  });
  res.status(200).json(number);
};
