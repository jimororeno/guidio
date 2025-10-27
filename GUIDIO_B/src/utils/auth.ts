import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = (process.env.JWT_EXPIRATION as SignOptions["expiresIn"]) || "1h";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export function generateToken(payload: object): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  // ✅ Cast correcto para evitar la sobrecarga errónea
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
