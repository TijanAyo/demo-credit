import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { environment } from "../config";

export const hashPayload = async (data: string) => {
  const salt = Number(environment.SALT_ROUND);
  if (isNaN(salt)) {
    throw new Error("Invalid SALT environment variable");
  }
  return await bcrypt.hash(data, Number(environment.SALT_ROUND));
};

export const compareHash = async (payload: string, hashedPayload: string) => {
  return await bcrypt.compare(payload, hashedPayload);
};

export const generateAccessToken = async (userId: string) => {
  const payload = { userId };
  return jwt.sign(payload, environment.JWT_SECRET);
};
