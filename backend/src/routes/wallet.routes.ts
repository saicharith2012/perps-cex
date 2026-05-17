import { Router } from "express";
import { fetchEquity, onrampFunds } from "../controllers/wallet.controllers";

const router = Router()

router.post("/onramp", onrampFunds)
router.get("/equity/available", fetchEquity)

export default router