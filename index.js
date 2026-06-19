import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoute.js";
import productRoutes from "./src/routes/productRoute.js";
import logger from "./src/utils/logger.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

app.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    code: err.code || "INTERNAL_ERROR",
    message: message,
    details: err.details || null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
