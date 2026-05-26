import * as z from "zod"

export const marketSchema = z.object({
    marketId: z.string().min(1, "market Id is required."),
    imageUrl: z.string().min(1, "image url is required.")
})