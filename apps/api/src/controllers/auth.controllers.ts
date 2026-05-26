import type { RequestHandler } from "express";
import { authSchema } from "../types/authSchema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtSecret } from "../utils/env";
import prisma from "@repo/db/client";
import { sendValidationError } from "../utils/validation";
import { sendToEngine } from "../utils/engine-client";
import { EngineCommandType } from "@repo/common/engineTypes";

export const signup: RequestHandler = async (req, res) => {
  try {
    const parsedBody = authSchema.safeParse(req.body);

    if (!parsedBody.success) {
      sendValidationError(res, parsedBody.error);
      console.log(parsedBody.error);
      return;
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
        positions: {
          create: [],
        },
        maker_fills: {
          create: [],
        },
        taker_fills: {
          create: [],
        },
        orders: {
          create: [],
        },
      },
    });

    console.log("sending request to engine to initiate user balance");
    const engineResponse = await sendToEngine({
      type: String(EngineCommandType.INITIATE_USER),
      payload: { userId: user.id },
    });

    res.status(engineResponse.ok ? 200 : 400).json(
      engineResponse.ok
        ? {
            message: "signedup successfully.",
            userId: user.id,
          }
        : { error: "error while initiating user on the exchange" },
    );
  } catch (error) {
    console.log(
      error instanceof Error ? error.message : `internal server error`,
    );
    res.status(500).json({
      error: error instanceof Error ? error.message : `internal server error`,
    });
  }
};

export const signin: RequestHandler = async (req, res) => {
  try {
    const parsedBody = authSchema.safeParse(req.body);

    if (!parsedBody.success) {
      sendValidationError(res, parsedBody.error);
      console.log(parsedBody.error);
      return;
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
    console.log(
      error instanceof Error ? error.message : `internal server error`,
    );
    res.status(500).json({
      error: error instanceof Error ? error.message : `internal server error`,
    });
  }
};
