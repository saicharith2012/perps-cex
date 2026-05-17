import { Router } from "express";
import { createOrder, deleteOrder, fetchAllOrders, fetchOpenOrders } from "../controllers/orders.controllers";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router()

router.post("/", authenticateUser, createOrder)
router.delete("/", authenticateUser, deleteOrder)
router.get("/open/:marketId", fetchAllOrders)
router.get("/:marketId", fetchOpenOrders)

export default router