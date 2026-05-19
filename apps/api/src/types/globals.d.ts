export type Order = {
  availableQty: number;
  openOrders: {
    userId: number;
    qty: number;
    filledQty: number;
    orderId: number;
    createdAt: Date;
  }[];
};

export type Orderbook = {
  bids: Record<string, Order>;
  asks: Record<string, Order>;
  lastTradedPrice: number;
  indexPrice: number;
};

export type Orderbooks = Record<string, Orderbook>;

export interface Collateral {
    available: number,
    locked: number
}

export type Type = "SHORT" | "LONG"
export type OrderType = "limit" | "market"
export type OrderStatus = "open" | "partially_filled" | "filled" | "cancelled"

export interface Position {
    market: string,
    type: Type,
    qty: number,
    margin: number,
    liquidationPrice: number,
    pnL: number,
    averagePrice: number
}

export interface OrderRecord {
    orderId: string,
    market: string,
    type: Type,
    qty: number,
    margin: number,
    orderType: OrderType,
    price: number,
    status: OrderStatus
}

export interface User {
    userId: string,
    username: string,
    password: string,
    collateral: Collateral,
    positions: Position[],
    orders: OrderRecord[]
}

export interface Fills {
    maker: string,
    taker: string,
    market: string,
    qty: number,
    price: number,
    long: number, 
    short: number
}

export interface MarketPrice {

}