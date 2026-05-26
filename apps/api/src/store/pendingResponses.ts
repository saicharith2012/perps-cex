import type { EngineRequest, EngineResponse } from "@repo/common/engineTypes";
import { toEngineStreamKey } from "../utils/env";
import { publisher } from "../utils/engine-client";

export const PENDING_RESPONSES = new Map<
  string,
  {
    resolve: (value: EngineResponse) => void;
    reject: (reason: Error) => void;
    timeout: ReturnType<typeof setTimeout>;
  }
>();

export async function waitForEngineResponse(
  correlationId: string,
  timeoutInMs: number,
): Promise<EngineResponse> {
  return new Promise(
    (
      resolve: (value: EngineResponse) => void,
      reject: (reason: Error) => void,
    ) => {
      const timeout = setTimeout(async () => {
        PENDING_RESPONSES.delete(correlationId);
        reject(new Error("engine response timed out."));
      }, timeoutInMs);
      PENDING_RESPONSES.set(correlationId, {
        resolve,
        reject,
        timeout,
      });
      console.log(PENDING_RESPONSES);
    },
  );
}

export async function resolveEngineResponse(
  response: EngineResponse,
): Promise<void> {
  const pending = PENDING_RESPONSES.get(response.correlationId);

  if (!pending) return;

  clearTimeout(pending.timeout);
  PENDING_RESPONSES.delete(response.correlationId);
  pending.resolve(response);

  console.log(PENDING_RESPONSES);
}
