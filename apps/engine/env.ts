function requiredEnv(name: string): string {
    const value = process.env[name]
    
    if (!value) throw new Error(`Missing environmental variable: ${name}`)

    return value
}

export const redisUrl = requiredEnv("REDIS_URL")
