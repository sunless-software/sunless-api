import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "./interfaces";
import { Response } from "express";

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
  expiresIn: "1h" | "4h" | "8h" | "1d"
) {
  return jwt.sign(payload, secret, { expiresIn: expiresIn });
}

export function sendResponse<T>(response: ApiResponse<T>, res: Response) {
  return res.status(response.status).send(response);
}
