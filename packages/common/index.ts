export enum EngineCommandType {
  CREATE_ORDER = "CREATE_ORDER",
  ONRAMP_BALANCE = "ONRAMP_BALANCE",
  CREATE_MARKET = "CREATE_MARKET",
  INITIATE_USER = "INITIATE_USER",
}

export type Side = "BUY" | "SELL";

export type OrderType = "LIMIT" | "MARKET";

export type OrderStatus = "OPEN" | "PARTIALLY_FILLED" | "FILLED" | "CANCELLED";

export type PositionType = "SHORT" | "LONG";

export type OnrampBalanceInput = {
  userId: string;
  amount: string;
};

export type CreateMarketInput = {
  marketId: string;
};

export type InitiateUserInput = {
  userId: string;
};

export type CreateOrderInput = {
  orderId: string;
  userId: string;
  marketId: string;
  type: OrderType;
  side: Side;
  price: number | null;
  qty: number;
  margin: number;
  leverage: number;
  slippage: number | null;
};

export type EngineRequest = {
  type: string;
  correlationId: string;
  payload:
    | CreateOrderInput
    | OnrampBalanceInput
    | CreateMarketInput
    | InitiateUserInput;
};

export type EngineRequestWithoutCorrelationId = Omit<
  EngineRequest,
  "correlationId"
>;

export type InitiateUserResponse = {
  message: string;
};

export type OnrampBalanceResponse = {
  message: string;
  currentBalance: Collateral;
};

export type CreateMarketResponse = {
  message: string;
  orderbook: Orderbook;
};

export type CreateOrderResponse = {
  message: string;
  orderId: string;
  userId: string;
  marketId: string;
  averagePrice: number;
  status: OrderStatus;
  remainingQty: number;
  filledQty: number;
  fills: Fill[];
  position: Position[];
};

export type EngineResponse = {
  data?:
    | CreateOrderResponse
    | InitiateUserResponse
    | OnrampBalanceResponse
    | CreateMarketResponse;
  error?: string;
  correlationId: string;
  ok: boolean;
};

export type RedisStreamMessageType = {
  name: string;
  messages: {
    id: string;
    message: {
      [x: string]: string;
    };
    millisElapsedFromDelivery?: number | undefined;
    deliveriesCounter?: number | undefined;
  }[];
}[];

// engine store types

export type Orders = {
  availableQty: number;
  openOrders: {
    orderId: string;
    qty: number;
    filledQty: number;
    userId: string;
    createdAt: number;
  }[];
};

export type Orderbook = {
  asks: Map<number, Orders>; // price as key
  bids: Map<number, Orders>;
  lastTradedPrice: number;
  indexPrice: number;
};

export type Collateral = {
  available: number;
  locked: number;
};

export type Position = {
  positionId: string;
  userId: string;
  marketId: string;
  type: PositionType;
  margin: number;
  entryPrice: number;
  leverage: number;
  qty: number;
  liquidationPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  createdAt: string;
};

export type Fill = {
  fillId: string;
  maker: string;
  taker: string;
  marketId: string;
  qty: string;
  price: string;
  makerOrderId: string;
  takerOrderId: string;
  createdAt: string;
};
