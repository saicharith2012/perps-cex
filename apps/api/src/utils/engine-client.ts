import {createClient} from "redis"
import { redisUrl } from "./env"

// create a publisher client to send events to the incoming queue
const publisher = createClient({url: redisUrl}).on('error', e => console.error("Redis client error", e))

// create a subscriber client to receive data send by the matching engine through the response queue
const subscriber = createClient({url: redisUrl}).on('error', e => console.error("Redis client error", e))

// connect to both the clients on redis
export async function connectRedis(): Promise<void> {
    await Promise.all([publisher.connect(), subscriber.connect()])
}

// ping redis
export async function pingRedis() {
    return publisher.ping()
}

// send message with a specific command type to engine using publisher through incoming queue and return a promise containing the engine response

// receive message from the matching engine through the response queue
