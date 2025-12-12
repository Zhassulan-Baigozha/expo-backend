// src/index.ts
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.get("/", (_req, res) => {
	res.json({ status: "Hello World" });
});

const port = Number(process.env.PORT) || 8080;

app.listen(port, "0.0.0.0", () => {
	console.log(`Server is running on port ${port}`);
});
