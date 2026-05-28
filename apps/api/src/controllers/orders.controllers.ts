import type { RequestHandler } from "express";
import { createOrderSchema } from "../types/orderschema";
import { sendValidationError } from "../utils/validation";
import { sendToEngine } from "../utils/engine-client";
import { EngineCommandType } from "@repo/common/engineTypes";
import prisma from "@repo/db/client";

// create order
// delete order
// get orders
// get open orders

export const createOrder: RequestHandler = async (req, res) => {
  const userId = req.userId;
  console.log(`creating order for ${userId}`);

  const parsedBody = createOrderSchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendValidationError(res, parsedBody.error);
    console.log(parsedBody.error);
    return;
  }
  try {
    const { marketId, side, type, price, qty, margin, leverage, slippage } =
      parsedBody.data;

    const market = await prisma.market.findUnique({
      where: {
        marketId,
      },
    });

    if (!market) {
      res.status(404).json({
        message: "market not found.",
      });
      return;
    }

    const engineResponse = await sendToEngine({
      type: EngineCommandType.CREATE_ORDER,
      payload: {
        orderId: crypto.randomUUID(),
        userId,
        marketId,
        side,
        type,
        price,
        qty,
        margin,
        leverage,
        slippage,
      },
    });

    res
      .status(engineResponse.ok ? 200 : 400)
      .json(
        engineResponse.ok
          ? { ...engineResponse.data }
          : { error: engineResponse.error },
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

export const deleteOrder: RequestHandler = async (req, res) => {};

export const fetchAllOrders: RequestHandler = async (req, res) => {};

export const fetchOpenOrders: RequestHandler = async (req, res) => {};
