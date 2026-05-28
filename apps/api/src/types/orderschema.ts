import * as z from "zod";

export const createOrderSchema = z.object({
  marketId: z.string().min(1),
  side: z.enum(["BUY", "SELL"]),
  type: z.enum(["LIMIT", "MARKET"]),
  price: z.number().positive(),
  qty: z.number().positive(),
  margin: z.number().positive(),
  leverage: z.number().positive(),
  slippage: z.number().positive().optional(),
});
