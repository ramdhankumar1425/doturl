import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/errors/ApiError.js";

export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues[0].message || "Invalid body.";
      throw new ApiError(400, "VALIDATION_ERROR", message);
    }

    req.body = result.data;
    next();
  };

export const validateParams =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const message = result.error.issues[0].message || "Invalid params.";
      throw new ApiError(400, "VALIDATION_ERROR", message);
    }

    req.params = result.data;
    next();
  };

export const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const message = result.error.issues[0].message || "Invalid query.";
      throw new ApiError(400, "VALIDATION_ERROR", message);
    }

    res.locals.validatedQuery = result.data;
    next();
  };
