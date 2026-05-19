import { Router } from "express";
import { fetchEquity, onrampFunds } from "../controllers/wallet.controllers";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/onramp", authenticateUser, onrampFunds);
router.get("/equity/available", fetchEquity);

export default router;
