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

export type EngineResponse = {
  data?: InitiateUserResponse;
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
