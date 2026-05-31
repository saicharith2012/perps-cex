import type { EngineResponse } from "@repo/common/engineTypes";
import { BALANCES, ORDERBOOKS, POSITIONS } from "../store/engineStore";

export function resetEngine(correlationId: string): EngineResponse {
  ORDERBOOKS.clear();
  BALANCES.clear();
  POSITIONS.clear();

  console.log(`ORDERBOOKS: ${JSON.stringify(ORDERBOOKS)}`);
  console.log(`BALANCES: ${JSON.stringify(BALANCES)}`);
  console.log(`POSITIONS: ${JSON.stringify(POSITIONS)}`);
  return {
    data: {
      message: "matching engine is succesfully reset.",
    },
    correlationId,
    ok: true,
  };
}
