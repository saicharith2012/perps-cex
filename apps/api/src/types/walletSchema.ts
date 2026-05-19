import * as z from "zod"

export const onrampFundsSchema = z.object({
    amount: z.number().positive("enter the collateral amount.")
})