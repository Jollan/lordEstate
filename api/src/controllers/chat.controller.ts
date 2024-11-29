import { AsyncRequestHandler } from "../models/root.model";
import prisma from "../prisma";

export const getChats: AsyncRequestHandler = async (req, res) => {
  const chats = await prisma.chat.findMany({
    where: {
      userIds: {
        hasSome: [req.user!.id],
      },
    },
    include: {
      users: { select: { id: true, username: true, avatar: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  res.status(200).json(chats);
};

export const getChat: AsyncRequestHandler = async (req, res) => {
  const chat = await prisma.chat.update({
    where: {
      id: req.params.id,
      userIds: {
        hasSome: [req.user!.id],
      },
    },
    data: {
      seenBy: {
        push: [req.user!.id],
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  res.status(200).json(chat);
};

export const addChat: AsyncRequestHandler = async (req, res) => {
  const chat = await prisma.chat.create({
    data: {
      userIds: [req.user!.id, req.body.correspondentId],
      seenBy: [req.user!.id, req.body.correspondentId],
    },
    include: {
      users: { select: { id: true, username: true, avatar: true } },
    },
  });
  res.status(201).json(chat);
};

export const readChat: AsyncRequestHandler = async (req, res) => {
  const chat = await prisma.chat.update({
    where: {
      id: req.params.id,
      userIds: {
        hasSome: [req.user!.id],
      },
    },
    data: {
      seenBy: {
        push: [req.user!.id],
      },
    },
  });
  res.status(200).json(chat);
};
