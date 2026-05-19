import Router from "express";
import { fetchFills } from "../controllers/fills.controllers";

const router = Router();

router.get("/", fetchFills);

export default router
