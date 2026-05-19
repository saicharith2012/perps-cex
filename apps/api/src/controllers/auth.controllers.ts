import type { RequestHandler } from "express";
import { authSchema } from "../types/authSchema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtSecret } from "../utils/env";
import prisma from "@repo/db/client"

export const signup: RequestHandler = async (req, res) => {
  try {
    const parsedBody = authSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new Error(parsedBody.error.issues[0]?.message);
    }

    const { username, password } = parsedBody.data;

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (userAlreadyExists) {
      res.status(409).json({
        error: "user already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        collateral: {
          create: {
            available: 0,
            locked: 0,
          },
        },
      },
    });

    // console.log(USERS);

    res.status(201).json({
      message: "signedup successfully.",
      userId: user.id,
    });
  } catch (error) {
    console.log(`internal server error: ${(error as Error).message}`);
    res.status(500).json({
      error: `internal server error: ${(error as Error).message}`,
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

    const existingUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        error: "user not found.",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      res.status(401).json({
        error: "invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      jwtSecret,
    );

    res.status(200).json({
      message: "signedin succesfully.",
      token,
    });
  } catch (error) {
    console.log(`internal server error: ${(error as Error).message}`);
    res.status(500).json({
      error: `internal server error: ${(error as Error).message}`,
    });
  }
};
