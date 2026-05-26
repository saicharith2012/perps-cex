import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/env";
import prisma from "@repo/db/client";

export const authenticateUser: RequestHandler = async (req, res, next) => {
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

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      res.status(401).json({
        error: "invalid token. no user found.",
      });
      return;
    }

    req.userId = userId;
    req.role = existingUser.role;

    next();
  } catch (error) {
    res.status(401).json({
      error: `internal server error: ${error}`,
    });
  }
};

export const authorizeAdmin: RequestHandler = async (req, res, next) => {
  try {

    if (req.role === "ADMIN") {
      next();
    } else {
      res.status(403).json({
        error: `403 forbidden.`,
      });
    }
  } catch (error) {
    res.status(403).json({
      error: `internal server error: ${error}`,
    });
  }
};
