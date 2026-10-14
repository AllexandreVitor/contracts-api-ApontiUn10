import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("Global Error Handler:", err);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}