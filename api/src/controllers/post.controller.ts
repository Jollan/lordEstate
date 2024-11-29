import { AsyncRequestHandler } from "../models/root.model";
import prisma from "../prisma";

export const getPosts: AsyncRequestHandler = async (req, res) => {
  let { type, city, minPrice, maxPrice, property, bedroom, page, limit } =
    req.query as any;

  [type, city, minPrice, maxPrice, property, bedroom, page, limit] = [
    ...[type, city, minPrice, maxPrice, property, bedroom, page, limit].map(
      (val) => {
        return !val || typeof val !== "string" ? undefined : val.toLowerCase();
      }
    ),
  ];

  const p = +page || 1;
  const take = +limit || 30;
  const skip = (p - 1) * take;

  const count = await prisma.post.count();

  const posts = await prisma.post.findMany({
    where: {
      city: {
        name: {
          equals: city,
          mode: "insensitive",
        },
      },
      type,
      property,
      bedroom: +bedroom || undefined,
      price: {
        gte: +minPrice || undefined,
        lte: +maxPrice || undefined,
      },
    },
    include: {
      city: { select: { name: true } },
      savedPosts: { select: { userId: true } },
    },
    skip,
    take,
  });
  res.status(200).json({ nbPage: Math.ceil(count / take), count, posts });
};

export const getPost: AsyncRequestHandler = async (req, res) => {
  const id = req.params.id;
  const post = await prisma.post.findUniqueOrThrow({
    where: { id },
    include: {
      postDetail: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
      savedPosts: { select: { userId: true } },
    },
  });
  res.status(200).json(post);
};

export const addPost: AsyncRequestHandler = async (req, res) => {
  const { postData, postDetail } = req.body;
  const { city: name, ...inputs } = postData;

  const city = await findOrCreateCity(name);

  const post = await prisma.post.create({
    data: {
      ...inputs,
      ...(city && { cityId: city.id }),
      userId: req.user!.id,
      postDetail: {
        create: postDetail,
      },
    },
  });
  res.status(201).json(post);
};

export const updatePost: AsyncRequestHandler = async (req, res) => {
  const { postData, postDetail } = req.body;
  const { city: name, ...inputs } = postData;
  const id = req.params.id;

  const city = await findOrCreateCity(name);

  const post = await prisma.post.update({
    where: { id, userId: req.user!.id },
    data: {
      ...inputs,
      ...(city && { cityId: city.id }),
      postDetail: { update: postDetail },
    },
  });
  res.status(200).json(post);
};

export const deletePost: AsyncRequestHandler = async (req, res) => {
  const id = req.params.id;

  await prisma.post.delete({
    where: { id, userId: req.user!.id },
  });
  res.status(204).end();
};

export const getCities: AsyncRequestHandler = async (req, res) => {
  const cities = await prisma.city.findMany();
  res.status(200).json(cities);
};

async function findOrCreateCity(name: string) {
  let city = await prisma.city.findFirst({ where: { name } });
  if (name && !city) {
    city = await prisma.city.create({ data: { name } });
  }
  return city;
}
