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

  const orderbook = {
    asks: new Map<number, Orders>(),
    bids: new Map<number, Orders>(),
    lastTradedPrice: 0,
    indexPrice: 0,
  };

  ORDERBOOKS.set(marketId, orderbook);

  console.log(`ORDERBOOK after adding the new market: ${JSON.stringify([...ORDERBOOKS])}`)

  return {
    correlationId,
    ok: true,
    data: {
      message: `'${marketId}' market created.`,
      orderbook,
    },
  };
}
