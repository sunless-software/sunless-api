import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "./interfaces";
import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import {
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "./constants/httpStatusCodes";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  UNEXPECTED_ERROR_DEFAULT_MESSAGE,
} from "./constants/messages";
import logger from "./logger";
import crypto from "crypto";

export async function encryptPassword(password: string) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  return hash;
}

export async function checkPassword(password: string, hash: string) {
  const match = await bcrypt.compare(password, hash);
  return match;
}

export function signJWT(
  payload: object,
  secret: string,
  expiresIn: "1h" | "4h" | "8h" | "1d" | "1w"
) {
  return jwt.sign(payload, secret, { expiresIn: expiresIn });
}

export function sendResponse<T>(response: ApiResponse<T>, res: Response) {
  return res.status(response.status).send(response);
}

export function validateResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    validationResult(req).throw();
    return next();
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "array" in error &&
      typeof error.array === "function"
    ) {
      const response: ApiResponse<null> = {
        status: HTTP_STATUS_CODE_BAD_REQUEST,
        message: "Invalid request",
        data: error.array(),
        pagination: {
          offset: 0,
          limit: 0,
          count: 0,
          total: 0,
        },
      };

      return sendResponse(response, res);
    }

    logger.error(
      "Error while trying to validate the result of a validation. Are you sure you are calling this function from a validation?"
    );
    return sendResponse(
      {
        ...DEFAULT_SUCCES_API_RESPONSE,
        status: HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
        message: UNEXPECTED_ERROR_DEFAULT_MESSAGE,
      },
      res
    );
  }
}

export function isPgError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error;
}

/**
 * Encrypts a given text using AES-256-CBC.
 * If a encryptionKey is provided, it uses that key; otherwise it falls back to the master SECRET.
 * Returns a string containing the IV and ciphertext, concatenated in base64.
 */
export function encryptText(text: string, encryptionKey?: string) {
  const secret = process.env.SECRET || encryptionKey;
  if (!secret) return "";

  const secretKey = Buffer.from(secret, "base64");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);

  let encrypted = cipher.update(text, "utf-8", "base64");
  encrypted += cipher.final("base64");

  return `${iv.toString("base64")}:${encrypted}`;
}

/**
 * Decrypts a text previously encrypted with AES-256-CBC.
 * Uses the provided decryptionKey or falls back to the master SECRET if none is given.
 * Expects the input in the format "IV:ciphertext" in base64 and returns the original plaintext.
 */
export function decryptText(text: string, decryptionKey?: string) {
  const secret = process.env.SECRET || decryptionKey;
  if (!secret) return "";

  const secretKey = Buffer.from(secret, "base64");
  const [ivBase64, encryptedBase64] = text.split(":");
  if (!ivBase64 || !encryptedBase64) throw new Error("Invalid payload format");

  const iv = Buffer.from(ivBase64, "base64");
  const encrypted = Buffer.from(encryptedBase64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf-8");
}
