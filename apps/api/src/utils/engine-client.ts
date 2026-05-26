import { createClient } from "redis";
import {
  backendConsumerGroup,
  fromEngineStreamKey,
  redisUrl,
  toEngineStreamKey,
} from "./env";
import type {
  EngineRequest,
  EngineRequestWithoutCorrelationId,
  EngineResponse,
  RedisStreamMessageType,
} from "@repo/common/engineTypes";
import {
  PENDING_RESPONSES,
  resolveEngineResponse,
  waitForEngineResponse,
} from "../store/pendingResponses";

// create a publisher client to send events to the incoming queue
export const publisher = createClient({ url: redisUrl }).on("error", (e) =>
  console.error("Redis client error", e),
);

// create a subscriber client to receive data send by the matching engine through the response queue
export const subscriber = createClient({ url: redisUrl }).on("error", (e) =>
  console.error("Redis client error", e),
);

// connect to both the clients on redis
export async function connectRedis(): Promise<void> {
  await Promise.all([publisher.connect(), subscriber.connect()]);
}

export async function sendToEngine(
  message: EngineRequestWithoutCorrelationId,
): Promise<EngineResponse> {
  const correlationId = crypto.randomUUID();

  const serializedMessage = {
    type: message.type,
    correlationId,
    ...(message.payload && { payload: JSON.stringify(message.payload) }),
  };
  console.log(`publishing message to the stream - '${toEngineStreamKey}'`);

  await publisher.xAdd(toEngineStreamKey, "*", serializedMessage);

  const resultPromise = await waitForEngineResponse(correlationId, 10000);

  return resultPromise;
}

export async function listenForResponsesFromEngine(): Promise<void> {
  console.log("trying to create consumer group...");
  try {
    await subscriber.xGroupCreate(
      fromEngineStreamKey,
      backendConsumerGroup,
      "$",
      {
        MKSTREAM: true,
      },
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("BUSYGROUP")) {
      console.log(`stream group '${fromEngineStreamKey}' already exists`);
    }
  }

  let firstIteration = true;
  while (true) {
    if (firstIteration) {
      console.log(`listening to the ${fromEngineStreamKey} stream`);
      firstIteration = false;
    }

    try {
      const response = (await subscriber.xReadGroup(
        backendConsumerGroup,
        "backend",
        { key: fromEngineStreamKey, id: ">" },
        { BLOCK: 1000, COUNT: 1 },
      )) as RedisStreamMessageType;

      // console.log(JSON.stringify(response));

      if (!response || !response[0]?.messages[0]) {
        continue;
      }

      const { correlationId, ...message } = response[0]?.messages[0]?.message;

      if (!correlationId) {
        continue;
      }

      if (!message.data) {
        continue;
      }

      let engineResponse: EngineResponse;

      if (message.ok?.toLowerCase() === "true") {
        engineResponse = {
          ok: true,
          correlationId,
          data: JSON.parse(message.data),
        };
      } else {
        engineResponse = {
          ok: false,
          correlationId,
          error: message.error,
        };
      }

      if (PENDING_RESPONSES.get(correlationId)) {
        resolveEngineResponse(engineResponse);
      }
    } catch (error) {
      console.error("invalid engine response", error);
    }
  }
}

// ping redis
export async function pingRedis() {
  return publisher.ping();
}
