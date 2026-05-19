import express from "express";
import { port } from "./utils/env";
import authRouter from "./routes/auth.routes";
import ordersRouter from "./routes/orders.routes";
import walletRouter from "./routes/wallet.routes";
import positionsRouter from "./routes/positions.routes";
import fillsRouter from "./routes/fills.routes";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/api/v1/positions", positionsRouter);
app.use("/api/v1/fills", fillsRouter);

app.listen(port, () => {
  console.log(`server running on port ${port}...`);
});
