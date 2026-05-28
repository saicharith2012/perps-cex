import type {
  CreateOrderInput,
  EngineResponse,
  Fill,
  Orders,
} from "@repo/common/engineTypes";
import { BALANCES, ORDERBOOKS } from "../store/engineStore";

export function createOrder(
  payload: CreateOrderInput,
  correlationId: string,
): EngineResponse {
  const {
    orderId,
    userId,
    marketId,
    side,
    type,
    price,
    qty,
    margin,
    leverage,
    slippage,
  } = payload;

  const userBalance = BALANCES.get(userId);
  let orderQty = qty;

  if (!userBalance) {
    return {
      error: "user doesn't have a valid balance on exchange",
      correlationId,
      ok: false,
    };
  }

  let orderbook = ORDERBOOKS.get(marketId);
  if (!orderbook) {
    orderbook = {
      asks: new Map<number, Orders>(),
      bids: new Map<number, Orders>(),
      lastTradedPrice: 0,
      indexPrice: 0,
    };

    ORDERBOOKS.set(marketId, orderbook);
  }

  console.log(orderbook);

  const asks = orderbook.asks;
  const bids = orderbook.bids;
  const Fills: Fill[] = [];

  if (type === "LIMIT") {
    if (!price) {
      return {
        error: "price is required for a limit order",
        correlationId,
        ok: false,
      };
    }

    // check if price, qty, leverage and margin add up.
    if (margin < (price * qty) / leverage) {
      return {
        error: "Invalid margin input.",
        correlationId,
        ok: false,
      };
    }

    // check if user has enough collateral
    if (userBalance.available < margin) {
      return {
        error: "Not enough balance available to open the order.",
        correlationId,
        ok: false,
      };
    }

    console.log(
      `before locking margin: ${JSON.stringify(BALANCES.get(userId))}`,
    );

    // lock the balance
    userBalance.available -= margin;
    userBalance.locked += margin;

    console.log(
      `after locking margin: ${JSON.stringify(BALANCES.get(userId))}`,
    );

    if (side === "BUY") {
      // if there are no asks to match

      if (asks.size === 0) {
        console.log("no asks to match, creating a new bid order...");
        bids.set(price, {
          availableQty: bids.get(price)?.availableQty ?? 0 + orderQty,
          openOrders: [
            ...(bids.get(price)?.openOrders ?? []),
            {
              orderId,
              qty,
              filledQty: 0,
              userId,
              createdAt: Date.now(),
            },
          ],
        });

        console.log("added it to the bids side of the orderbook.");

        console.log(`ORDERBOOK: ${JSON.stringify(ORDERBOOKS.get(marketId))}`);

        return {
          data: {
            message: "LIMIT order added to bids on the orderbook.",
            orderId: payload.orderId,
            userId: payload.userId,
            marketId: payload.marketId,
            averagePrice: 0,
            status: "OPEN",
            remainingQty: 0,
            filledQty: 0,
            fills: [],
            position: [],
          },
          ok: true,
          correlationId,
        };
      }

      // sort the orders on the asks based on prices
      orderbook.asks = new Map([...asks.entries()].sort((a, b) => a[0] - b[0]));

      for (const [askPrice, orders] of asks) {
        const restingOrders = orders.openOrders;

        if (restingOrders.length === 0) {
          asks.delete(askPrice);
          continue;
        }

        if (askPrice <= price && orderQty > 0) {
          for (const ro of restingOrders) {
            if (ro.qty === orderQty) {
              // create the fills for both resting ask order and limit buy order
              // remove the resting ask order from the orderbook
              // calculate net position for the buy order
              // calculate net position for the resting ask order
              // break
            } else if (ro.qty > orderQty) {
              // create the fill for the limit buy order and partial fill for the resting ask order
              // edit the ask order with remaining qty as open order on the orderbook
              // calculate net position for the limit buy order
              // calculate net position for the resting ask order
              // break
            } else if (ro.qty < orderQty) {
              // create fill for the resting ask order and partial fill for the limit buy order
              // remove the resting ask order from the orderbook
              // calculate net position for the resting ask order
              // continue the loop for more partial fills until orderQty becomes zero.
            }
          }
        } else if (askPrice > price && orderQty > 0) {
          // confirmed that the remaining prices can't be matched
          // so, confirm the partial filled order, calculate the net position for the limit buy order
          // open a bid on the orderbook for the remaining quantity
          // fill the response object with details corresponding to partial fill
          // break the loop
        } else if (orderQty === 0) {
          // fill the response object with details corresponding to fully filled order
          // break the loop
        }
      }
    } else if (side === "SELL") {
      // if there are no bids to match
      if (bids.size === 0) {
        console.log("no bids to match, creating a new ask order...");
        asks.set(price, {
          availableQty: asks.get(price)?.availableQty ?? 0 + orderQty,
          openOrders: [
            ...(asks.get(price)?.openOrders ?? []),
            {
              orderId,
              qty,
              filledQty: 0,
              userId,
              createdAt: Date.now(),
            },
          ],
        });

        console.log("added it to the asks side of the orderbook.");

        console.log(`ORDERBOOK: ${ORDERBOOKS.get(marketId)}`);

        return {
          data: {
            message: "LIMIT order added to asks on the orderbook.",
            orderId: payload.orderId,
            userId: payload.userId,
            marketId: payload.marketId,
            averagePrice: 0,
            status: "OPEN",
            remainingQty: 0,
            filledQty: 0,
            fills: [],
            position: [],
          },
          ok: true,
          correlationId,
        };
      }
    }
  }
  return {
    data: {
      message: "order logic not written yet. wait for a while.",
      orderId: payload.orderId,
      userId: payload.userId,
      marketId: payload.marketId,
      averagePrice: 0,
      status: "OPEN",
      remainingQty: 0,
      filledQty: 0,
      fills: [],
      position: [],
    },
    ok: true,
    correlationId,
  };
}
