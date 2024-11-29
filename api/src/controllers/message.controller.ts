import { AsyncRequestHandler } from "../models/root.model";
import prisma from "../prisma";

export const addMessage: AsyncRequestHandler = async (req, res) => {
  const chatId = req.params.chatId;
  const text = req.body.text;

  await prisma.chat.update({
    where: {
      id: chatId,
      userIds: {
        hasSome: [req.user!.id],
      },
    },
    data: {
      seenBy: [req.user!.id],
      lastMessage: text,
      updatedAt: Date.now(),
    },
  });

  const message = await prisma.message.create({
    data: {
      text,
      chatId,
      senderId: req.user!.id,
    },
    include: {
      chat: {
        include: {
          users: { select: { id: true, username: true, avatar: true } },
        },
      },
    },
  });
  res.status(201).json(message);
};

export const readMessage: AsyncRequestHandler = async (req, res) => {
  const message = await prisma.message.update({
    where: {
      chatId: req.params.chatId,
      id: req.params.id,
    },
    data: { read: true },
  });
  res.status(200).json(message);
};
