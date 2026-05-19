import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/env";
import { USERS } from "../engine-store";

export const authenticateUser: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        error: "unauthorized user.",
      });
      return;
    }

    const decodedToken = jwt.verify(token, jwtSecret);

    const { userId } = decodedToken as jwt.JwtPayload;

    const existingUser = USERS.find((user) => user.userId === userId);

    if (!existingUser) {
      res.status(401).json({
        error: "invalid token. no user found.",
      });
      return;
    }

    req.userId = userId;

    next();
  } catch (error) {
    res.status(401).json({
      error: `unauthorised user: ${error}`,
    });
  }
};
