import prisma from "@repo/db/client";
import type { RequestHandler } from "express";
import { marketSchema } from "../types/marketSchema";
import { sendValidationError } from "../utils/validation";
import { sendToEngine } from "../utils/engine-client";
import {
  EngineCommandType,
  type CreateMarketResponse,
} from "@repo/common/engineTypes";

export const createMarket: RequestHandler = async (req, res) => {
  const parsedBody = marketSchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendValidationError(res, parsedBody.error);
    console.log(parsedBody.error);
    return;
  }

  const { marketId, imageUrl } = parsedBody.data;
  try {
    const market = await prisma.market.create({
      data: {
        marketId,
        imageUrl,
      },
    });

    const engineResponse = await sendToEngine({
      type: String(EngineCommandType.CREATE_MARKET),
      payload: {
        marketId,
      },
    });

    res.status(engineResponse.ok ? 200 : 400).json(
      engineResponse.ok
        ? {
            message: engineResponse.data?.message,
            marketId: market.marketId,
            orderbook: (engineResponse.data as CreateMarketResponse).orderbook,
          }
        : {
            error: engineResponse.error,
          },
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
