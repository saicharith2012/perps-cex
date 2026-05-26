import Router from "express";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middleware/auth.middleware";
import { createMarket } from "../controllers/market.controllers";

const router = Router();

// create market
router.post("/", authenticateUser, authorizeAdmin, createMarket);
export default router;
