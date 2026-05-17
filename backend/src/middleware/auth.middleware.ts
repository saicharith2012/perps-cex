import type { RequestHandler } from "express";

export const authenticateUser: RequestHandler = (req, res, next) => {
  next();
};
