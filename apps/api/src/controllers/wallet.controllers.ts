import type { RequestHandler } from "express";
import { onrampFundsSchema } from "../types/walletSchema";
import prisma from "@repo/db/client";
import { sendValidationError } from "../utils/validation";
import { sendToEngine } from "../utils/engine-client";
import {
  EngineCommandType,
  type OnrampBalanceResponse,
} from "@repo/common/engineTypes";

export const onrampFunds: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: "unauthorized.",
      });
      return;
    }

    const parsedBody = onrampFundsSchema.safeParse(req.body);

    if (!parsedBody.success) {
      sendValidationError(res, parsedBody.error);
      console.log(parsedBody.error);
      return;
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

    const engineResponse = await sendToEngine({
      type: String(EngineCommandType.ONRAMP_BALANCE),
      payload: { userId, amount: String(amount) },
    });

    res.status(engineResponse.ok ? 200 : 400).json(
      engineResponse.ok
        ? ({
            message: engineResponse.data?.message,
            currentBalance: (engineResponse.data as OnrampBalanceResponse)
              .currentBalance,
          } as OnrampBalanceResponse)
        : { error: "error while onramping balance" },
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

export const fetchEquity: RequestHandler = async (req, res) => {};
