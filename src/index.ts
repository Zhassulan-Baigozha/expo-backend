// src/index.ts
import dotenv from "dotenv";
import express from "express";
import { pool } from "./db";

dotenv.config();

const app = express();

const port = Number(process.env.PORT) || 8080;

app.get("/", (_req, res) => {
	res.json({ status: "Hello World" });
});

app.get("/health", async (_req, res) => {
	const { rows } = await pool.query("SELECT 1");
	res.json({ ok: true, db: rows[0] });
});

app.listen(port, "0.0.0.0", () => {
	console.log(`Server is running on port ${port}`);
});
