import type { RequestHandler } from "express";
import { onrampFundsSchema } from "../types/walletSchema";
import { USERS } from "../engine-store";

export const onrampFunds: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId;

    const parsedBody = onrampFundsSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new Error(parsedBody.error.issues[0]?.message);
    }

    const { amount } = parsedBody.data;

    const user = USERS.find((user) => user.userId === userId);

    if (!user) {
      res.status(403).json({
        error: "forbidden request.",
      });
      return;
    }

    user.collateral.available += amount;

    res.status(200).json({
      message: "user balance onramped successfully.",
      userId: user.userId,
      collateral: user.collateral
    });
  } catch (error) {
    res.status(500).json({
      error: `internal server error: ${error}`,
    });
  }
};

export const fetchEquity: RequestHandler = async (req, res) => {};
