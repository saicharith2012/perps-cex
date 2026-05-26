import type {
  EngineResponse,
  InitiateUserInput,
} from "@repo/common/engineTypes";
import { BALANCES } from "../engineStore";

export function initiateUser(
  payload: InitiateUserInput,
  correlationId: string,
): EngineResponse {
  BALANCES.set(payload.userId, {
    available: 0,
    locked: 0,
  });

  console.log(BALANCES);

  return {
    correlationId,
    data: {
      message: `user ${payload.userId} successfully initiated on the exchange.`,
    },
    ok: true,
  };
}
