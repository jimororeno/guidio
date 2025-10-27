import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth.js";
import { prisma } from "../config/prisma.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("--> authMiddleware called: " + new Date().toLocaleString());
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ code: "401", message: "No autorizado: falta el token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded)
      return res
        .status(401)
        .json({ code: "401", message: "Token inválido.", data: null });

    // 🔹 Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res
        .status(401)
        .json({ code: "401", message: "Usuario no encontrado" });
    }

    // 🔹 Adjuntar usuario a la request
    (req as any).user = user;

    next();
  } catch (error) {
    console.error("❌ Error en protect middleware:", error);
    res.status(401).json({ code: "401", message: "Token inválido o expirado" });
  }
};
