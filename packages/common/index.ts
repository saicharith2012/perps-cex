export enum EngineCommandType {
  CREATE_ORDER = "CREATE_ORDER",
  ONRAMP_BALANCE = "ONRAMP_BALANCE",
  CREATE_MARKET = "CREATE_MARKET",
  INITIATE_USER = "INITIATE_USER",
  
}

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

export type EngineRequest = {
  type: string,
  correlationId: string,
  payload: OnrampBalanceInput | CreateMarketInput | InitiateUserInput
}

export type EngineRequestWithoutCorrelationId = Omit<EngineRequest, "correlationId">

export type InitiateUserResponse = {
  message: string
}

export type OnrampBalanceResponse = {
  message: string,
  currentBalance: Collateral
}

export type CreateMarketResponse = {
  message: string,
  orderbook: Orderbook
}

export type EngineResponse = {
  data?: InitiateUserResponse | OnrampBalanceResponse | CreateMarketResponse;
  error?: string;
  correlationId: string;
  ok: boolean
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