import type {
  CreateMarketInput,
  EngineResponse,
  Orders,
} from "@repo/common/engineTypes";
import { ORDERBOOKS } from "../store/engineStore";

export function createMarket(
  message: CreateMarketInput,
  correlationId: string,
): EngineResponse {
  const { marketId } = message;

  ORDERBOOKS.set(marketId, {
    asks: new Map<number, Orders>(),
    bids: new Map<number, Orders>(),
    lastTradedPrice: 0,
    indexPrice: 0,
  });

  return {
    correlationId,
    ok: true,
    data: {
      message: `'${marketId}' market created.`,
      orderbook: ORDERBOOKS.get(marketId),
    },
  };
}
