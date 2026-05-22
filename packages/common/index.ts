export type EngineCommand = "create_order" | "onramp_balance" | "create_market";

export type EngineRequest = {
  orderId: string;
  correlationId: string;
  type: EngineCommand;
  payload: unknown;
  responseQueue: string;
};

export type EngineResponse = {
    orderId: string,
    data?: unknown,
    error?: unknown,
    correlationId: string
};
