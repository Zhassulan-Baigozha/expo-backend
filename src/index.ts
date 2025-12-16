// src/index.ts
import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { customersRouter } from "./routes/customers";

const app = express();
app.use(express.json());

const port = Number(process.env.PORT) || 8080;

app.get("/", (_req, res) => {
  res.json({ status: "Hello World" });
});

// 🔥 подключаем роутер
app.use("/customers", customersRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
