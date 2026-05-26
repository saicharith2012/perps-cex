function requiredEnv(name: string): string {
    const value = process.env[name]
    
    if (!value) throw new Error(`Missing environmental variable: ${name}`)

    return value
}

export const redisUrl = requiredEnv("REDIS_URL")
export const toEngineStreamKey = requiredEnv("TO_ENGINE_STREAM")
export const fromEngineStreamKey = requiredEnv("FROM_ENGINE_STREAM")
export const engineConsumerGroup = requiredEnv("ENGINE_CONSUMER_GROUP")