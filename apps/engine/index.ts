import { createClient } from "redis";
import {
  engineConsumerGroup,
  fromEngineStreamKey,
  redisUrl,
  toEngineStreamKey,
} from "./env";
import {
  EngineCommandType,
  type CreateMarketInput,
  type CreateOrderInput,
  type EngineRequest,
  type EngineResponse,
  type InitiateUserInput,
  type OnrampBalanceInput,
  type RedisStreamMessageType,
} from "@repo/common/engineTypes";
import { initiateUser } from "./handlers/initiateUser";
import { onrampBalance } from "./handlers/onrampBalance";
import { createMarket } from "./handlers/createMarket";
import { createOrder } from "./handlers/createOrder";

const publisher = createClient({ url: redisUrl }).on("error", (e) =>
  console.error("redis client error.", e),
);

const subscriber = createClient({ url: redisUrl }).on("error", (e) =>
  console.error("redis client error", e),
);

await Promise.all([publisher.connect(), subscriber.connect()]);

async function createConsumerGroup() {
  console.log("trying to create consumer group...");
  try {
    await subscriber.xGroupCreate(toEngineStreamKey, engineConsumerGroup, "$", {
      MKSTREAM: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("BUSYGROUP")) {
      console.log(`stream group '${toEngineStreamKey}' already exists`);
    }
  }
}

createConsumerGroup();

async function sendResponse(streamKey: string, response: EngineResponse) {
  const serializedResponse: Record<string, string> = {
    correlationId: response.correlationId,
    ok: String(response.ok),
    ...(response.error && { error: response.error }),
    ...(response.data && { data: JSON.stringify(response.data) }),
  };
  await publisher.xAdd(streamKey, "*", serializedResponse);
}

function handleEngineRequest(message: EngineRequest, correlationId: string) {
  switch (message.type) {
    case String(EngineCommandType.INITIATE_USER):
      return initiateUser(message.payload as InitiateUserInput, correlationId);
    case String(EngineCommandType.ONRAMP_BALANCE):
      return onrampBalance(
        message.payload as OnrampBalanceInput,
        correlationId,
      );
    case String(EngineCommandType.CREATE_MARKET):
      return createMarket(message.payload as CreateMarketInput, correlationId);
    case String(EngineCommandType.CREATE_ORDER):
      return createOrder(message.payload as CreateOrderInput, correlationId);
    default:
      throw new Error("unknown engine request type.");
  }
}

let firstIteration = true;

while (true) {
  if (firstIteration) {
    console.log(`listening to the ${toEngineStreamKey} stream`);
    firstIteration = false;
  }

  const response = (await subscriber.xReadGroup(
    engineConsumerGroup,
    "engine",
    [
      {
        key: toEngineStreamKey,
        id: ">",
      },
    ],
    {
      BLOCK: 100,
      COUNT: 1,
    },
  )) as RedisStreamMessageType;

  if (!response || !response[0]?.messages[0]) {
    // console.log("no message found.");
    continue;
  }

  console.log(`message: ${JSON.stringify(response)}`);

  const { correlationId, type, payload } = response[0]?.messages[0].message;

  if (!correlationId) {
    continue;
  }

  if (!type) {
    sendResponse(fromEngineStreamKey, {
      correlationId,
      error: "unidentified engine request type.",
      ok: false,
    });
    continue;
  }

  if (!payload) {
    sendResponse(fromEngineStreamKey, {
      correlationId,
      error: "insufficient data from the engine request.",
      ok: false,
    });
    continue;
  }

  const message: EngineRequest = {
    correlationId,
    type,
    payload: JSON.parse(payload),
  };

  try {
    const engineResponse = handleEngineRequest(message, correlationId);
    sendResponse(fromEngineStreamKey, engineResponse);
  } catch (error) {
    console.log(
      error instanceof Error
        ? error.message
        : `error while processing ${(message as EngineRequest).type} request.`,
    );
    const engineResponse: EngineResponse = {
      correlationId,
      ok: false,
      error: `${error instanceof Error ? error.message : "error while processing engine request"}`,
    };
    sendResponse(fromEngineStreamKey, engineResponse);
  }
}
