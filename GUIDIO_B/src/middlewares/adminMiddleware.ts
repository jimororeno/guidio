import { Request, Response, NextFunction } from "express";

/**
 * Middleware para permitir solo a administradores.
 * Debe usarse después de `protect`.
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      code: 401,
      message: "Usuario no autenticado",
      data: null,
    });
  }
  console.log("User profile:", req.user.profile);
  if (req.user.profile !== "admin") {
    return res.status(403).json({
      code: 403,
      message: "Acceso denegado: solo administradores",
      data: null,
    });
  }

  next();
};
