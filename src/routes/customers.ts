// src/routes/customers.ts
import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET customer by id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, login, name, surname FROM customers WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// CREATE customer
router.post("/", async (req, res) => {
  console.log("Creating customer with data:", req.body);
  const { login, name, surname } = req.body;

  if (!login || !name || !surname) {
    return res.status(400).json({
      message: "login, name and surname are required",
    });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO customers (login, name, surname)
      VALUES ($1, $2, $3)
      RETURNING id, login, name, surname
      `,
      [login, name, surname]
    );

    res.status(201).json(rows[0]);
  } catch (err: any) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(409).json({ message: "Customer already exists" });
    }

    res.status(500).json({ message: "Database error" });
  }
});

// UPDATE customer
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { login, name, surname } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  if (!login || !name || !surname) {
    return res.status(400).json({
      message: "login, name and surname are required",
    });
  }

  try {
    const { rowCount, rows } = await pool.query(
      `
      UPDATE customers
      SET login = $1, name = $2, surname = $3
      WHERE id = $4
      RETURNING id, login, name, surname
      `,
      [login, name, surname, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// DELETE customer
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM customers WHERE id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// GET all customers
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, login, name, surname FROM customers ORDER BY id"
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

export const customersRouter = router;
