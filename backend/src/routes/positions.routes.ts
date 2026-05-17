import Router from "express"
import { fetchClosedPositions, fetchOpenPositions } from "../controllers/positions.controllers";

const router = Router()

router.get("/open/:marketId", fetchOpenPositions);
router.get("/closed/:marketId", fetchClosedPositions);

export default router