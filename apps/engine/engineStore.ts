export type Orders = {
  availableQty: number,
  openOrder: {
    orderId: string,
    qty: number,
    filledQty: number,
    userId: string,
    createdAt: string
  }[]
}

export type Orderbook = {
  asks: Record<number, Orders>, // price as key
  bids: Record<number, Orders>,
  lastTradedPrice: number
  indexPrice: number
}

export type Collateral = {
  available: number, 
  locked: number
}

// marketId as key
export type Balance = Record<string, Collateral>

export type PositionType = "SHORT" | "LONG"


export type Position = {
  positionId: string,
  userId: string,
  marketId: string,
  type: PositionType,
  margin: number,
  entryPrice: number,
  leverage: number,
  qty: number,
  liquidationPrice: number,
  unrealizedPnL: number,
  realizedPnL: number,
  createdAt: string
}

// marketId as key
export const ORDERBOOKS = new Map<string, Orderbook>()

// userId as key
export const BALANCES = new Map<string, Balance>()

// userId as key for map, marketId as key for record
export const POSITIONS = new Map<string, Record<string, Position>>()
