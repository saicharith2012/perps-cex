import type { RequestHandler } from "express";
import { onrampFundsSchema } from "../types/walletSchema";
import prisma from "@repo/db/client";
import { sendValidationError } from "../utils/validation";

export const onrampFunds: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId;

    const parsedBody = onrampFundsSchema.safeParse(req.body);

    if (!parsedBody.success) {
      sendValidationError(res, parsedBody.error)
      console.log(parsedBody.error)
      return
    }

    const { amount } = parsedBody.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      res.status(403).json({
        error: "forbidden request.",
      });
      return;
    }

    const collateral = await prisma.collateral.update({
      where: {
        userId,
      },
      data: {
        available: {
          increment: amount,
        },
      },
    });

    res.status(200).json({
      message: "user balance onramped successfully.",
      userId,
      collateral: collateral,
    });
  } catch (error) {
    res.status(500).json({
      error: `internal server error: ${error}`,
    });
  }
};

export const fetchEquity: RequestHandler = async (req, res) => {};
