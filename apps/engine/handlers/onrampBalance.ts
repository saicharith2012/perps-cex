import type {
  EngineResponse,
  OnrampBalanceInput,
} from "@repo/common/engineTypes";
import { BALANCES } from "../store/engineStore";

export function onrampBalance(
  message: OnrampBalanceInput,
  correlationId: string,
): EngineResponse {
  const userBalance = BALANCES.get(message.userId);
  if (!userBalance) {
    return {
      ok: false,
      error: "user not found.",
      correlationId,
    };
  }

  userBalance.available += Number(message.amount);

  console.log(BALANCES);

  return {
    ok: true,
    data: {
      message: `user '${message.userId}' balance updated.`,
      currentBalance: userBalance
    },
    correlationId,
  };
}
