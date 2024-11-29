import { User } from "@prisma/client";
import e from "express";

export type AsyncRequestHandler = (
  req: e.Request & { user?: User & { admin?: boolean } },
  res: e.Response,
  next: e.NextFunction
) => Promise<any>;
