import type { ZodError } from "zod";
import type { Response } from "express";

export function sendValidationError(res: Response, err: ZodError): void {
  res.status(400).json({
    error: "validation_error",
    issues: err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  });
}
