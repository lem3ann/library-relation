import express from "express";
import categoryRouter from "./routes/categories-route.js";
import userRouter from "./routes/users-route.js";
import relationRouter from "./routes/books-add-categories.js";
import returnOrder from "./routes/orders-and-return.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/api", categoryRouter);
app.use("/api", relationRouter);
app.use("/api", userRouter);
app.use("/api", returnOrder);
app.listen(port, () => {
  console.log("Server Up ...");
});
