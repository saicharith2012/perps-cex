import type { RequestHandler } from "express";
import { authSchema } from "../types/authSchema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { users } from "../constants";
import { jwtSecret } from "../utils/env";

export const signup: RequestHandler = async (req, res) => {
  try {
    const parsedBody = authSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new Error(parsedBody.error.issues[0]?.message);
    }

    const { username, password } = parsedBody.data;

    const userAlreadyExists = users.find((user) => user.username);

    if (userAlreadyExists) {
      res.status(409).json({
        error: "user already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    users.push({
      userId: crypto.randomUUID(),
      username,
      password: hashedPassword,
      collateral: {
        available: 0,
        locked: 0,
      },
      positions: [],
      orders: [],
    });

    res.status(200).json("signedup successfully.");
  } catch (error) {
    res.json({
      error: `internal server error: ${error}`,
    });
  }
};

export const signin: RequestHandler = async (req, res) => {
  try {
    const parsedBody = authSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new Error(parsedBody.error.issues[0]?.message);
    }

    const { username, password } = parsedBody.data;

    const existingUser = users.find((user) => user.username === username);

    if (!existingUser) {
      res.status(404).json("user not found.");
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      res.status(401).json("invalid credentials.");
    }

    const token = jwt.sign(
      {
        userId: existingUser.userId,
      },
      jwtSecret,
    );

    res.status(200).json({
      message: "signedin succesfully.",
      token,
    });
  } catch (error) {
    res.json({
      error: `internal server error: ${error}`,
    });
  }
};
