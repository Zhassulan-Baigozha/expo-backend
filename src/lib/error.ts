import type { Prisma } from "../generated/prisma/client";

export const isPrismaError = (
  err: unknown,
): err is Prisma.PrismaClientKnownRequestError =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  typeof (err as { code: unknown }).code === "string";
