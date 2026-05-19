import type { RequestHandler } from "express";

// create order
// delete order
// get orders
// get open orders

export const createOrder: RequestHandler = async (req, res) => {
  const userId = req.userId
  console.log(`creating order for ${userId}`);

  res.json({
    message: `create order logic not implemented yet. please wait ${userId}`,
  });
};

export const deleteOrder: RequestHandler = async (req, res) => {};

export const fetchAllOrders: RequestHandler = async (req, res) => {};

export const fetchOpenOrders: RequestHandler = async (req, res) => {};
