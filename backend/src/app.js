// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Welcome to WhatsApp Web Clone API",
  });
});
// Use central routes file
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

export default app;
