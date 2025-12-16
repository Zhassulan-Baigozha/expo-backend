// src/routes/customers.ts
import { Router } from "express";
import type { CustomerBody } from "../interfaces";
import { isPrismaError } from "../lib/error";
import { parseId, safeBigInt, safeBigIntArray } from "../lib/number";
import { prisma } from "../lib/prisma";

const router = Router();

// GET customer by id
router.get("/:id", async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) return res.status(400).json({ message: "Invalid id" });

  try {
    const customer = await prisma.customers.findUnique({
      where: { id },
      select: { id: true, login: true, name: true, surname: true },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 🟢 Преобразуем id в string
    res.json(safeBigInt(customer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// CREATE customer
router.post("/", async (req, res) => {
  const { login, name, surname } = req.body as CustomerBody;

  if (!login || !name || !surname) {
    return res.status(400).json({
      message: "login, name and surname are required",
    });
  }

  try {
    const newCustomer = await prisma.customers.create({
      data: { login, name, surname },
      select: { id: true, login: true, name: true, surname: true },
    });

    // 🟢 Преобразуем id в string
    res.status(201).json(safeBigInt(newCustomer));
  } catch (err: unknown) {
    if (isPrismaError(err)) {
      if (err.code === "P2002") {
        return res.status(409).json({ message: "Customer already exists" });
      }
    }
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// UPDATE customer
router.put("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  const { login, name, surname } = req.body as CustomerBody;

  if (id === null) return res.status(400).json({ message: "Invalid id" });
  if (!login || !name || !surname) {
    return res.status(400).json({
      message: "login, name and surname are required",
    });
  }

  try {
    const updatedCustomer = await prisma.customers.update({
      where: { id },
      data: { login, name, surname },
      select: { id: true, login: true, name: true, surname: true },
    });

    // 🟢 Преобразуем id в string
    res.json(safeBigInt(updatedCustomer));
  } catch (err: unknown) {
    if (isPrismaError(err)) {
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Customer not found" });
      }
    }
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// DELETE customer
router.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) return res.status(400).json({ message: "Invalid id" });

  try {
    await prisma.customers.delete({ where: { id } });
    res.status(204).send();
  } catch (err: unknown) {
    if (isPrismaError(err)) {
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Customer not found" });
      }
    }
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// GET all customers
router.get("/", async (_req, res) => {
  try {
    const customers = await prisma.customers.findMany({
      select: { id: true, login: true, name: true, surname: true },
      orderBy: { id: "asc" },
    });

    // 🟢 Преобразуем массив id в string
    res.json(safeBigIntArray(customers));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

export const customersRouter = router;
