import { createClient } from "redis";
import { redisUrl } from "./env";

const publisher = createClient({ url: redisUrl }).on("error", (e) =>
  console.error("Redis client error", e),
);

const subscriber = createClient({ url: redisUrl }).on("error", (e) =>
  console.error("Redis client error", e),
);

await Promise.all([publisher.connect(), subscriber.connect()]);
