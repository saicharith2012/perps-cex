import type { CreateMarketInput, EngineResponse } from "@repo/common/engineTypes";
import { ORDERBOOKS } from "../engineStore";

export function createMarket(
  message: CreateMarketInput,
  correlationId: string,
): EngineResponse {
  const { marketId } = message;

  ORDERBOOKS.set(marketId, {asks: [], bids: [], lastTradedPrice: 0, indexPrice: 0})

  return {
    correlationId,
    ok: true,
    data: {
        message: `'${marketId}' market created.`,
        orderbook: ORDERBOOKS.get(marketId)
    }
  }
}
