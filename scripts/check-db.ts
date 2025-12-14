// scripts/check-db.ts
import dotenv from "dotenv";

dotenv.config();

import { pool } from "../src/db";

async function checkDb() {
  try {
    const { rows } = await pool.query("SELECT now()");
    console.log("✅ DB connection OK, time:", rows[0]);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  } finally {
    // закрываем пул, иначе процесс будет висеть
    await pool.end();
  }
}

checkDb();
