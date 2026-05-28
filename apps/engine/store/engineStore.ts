import type { Collateral, Orderbook, Position } from "@repo/common/engineTypes"

// marketId as key
export const ORDERBOOKS = new Map<string, Orderbook>()

// userId as key
export const BALANCES = new Map<string, Collateral>()

// userId as key for map, marketId as key for record
export const POSITIONS = new Map<string, Map<string, Position>>()
