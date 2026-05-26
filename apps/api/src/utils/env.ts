function requiredEnv(name: string):string {
    const value = process.env[name]

    if (!value) throw new Error(`environmental variable '${name} missing.'`)
    
    return value
}

export const port = Number(process.env.PORT ?? "3000")
export const jwtSecret = requiredEnv("JWT_SECRET")
export const redisUrl = requiredEnv("REDIS_URL")
export const toEngineStreamKey = requiredEnv("TO_ENGINE_STREAM")
export const fromEngineStreamKey = requiredEnv("FROM_ENGINE_STREAM")
export const backendConsumerGroup = requiredEnv("BACKEND_CONSUMER_GROUP")