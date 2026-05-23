function requiredEnv(name: string):string {
    const value = process.env[name]

    if (!value) throw new Error(`environmental variable '${name} missing.'`)
    
    return value
}

export const port = Number(process.env.PORT ?? "3000")
export const jwtSecret = requiredEnv("JWT_SECRET")
export const redisUrl = requiredEnv("REDIS_URL")
