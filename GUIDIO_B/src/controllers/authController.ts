import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../types/response.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import { User } from "@prisma/client";
import { HealthCheckData } from "../types/helthCheckData.js";

export const authController = {

  // REGISTER
  register: async (req: Request, res: Response) => {
    console.log("--> Register called:", new Date().toLocaleString());

    try {
      const { username, email, password, profile, picture } = req.body;
      let profileVar: string  = profile || "user";

      // --- VALIDACIÓN DE CAMPOS ---
      if (!username || !email || !password) {
        return res.status(400).json({
          code: "400",
          message: "Todos los campos obligatorios deben completarse.",
          data: null,
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          code: "400",
          message: "El formato del correo electrónico no es válido.",
          data: null,
        });
      }

      // Validar longitud mínima de contraseña
      if (password.length < 6) {
        return res.status(400).json({
          code: "400",
          message: "La contraseña debe tener al menos 6 caracteres.",
          data: null,
        });
      }

      // Verificar si ya existe un usuario con ese email o username
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          code: "409",
          message: "El correo o nombre de usuario ya está registrado.",
          data: null,
        });
      }

      // --- CREACIÓN DEL USUARIO ---
      const hashed = await hashPassword(password);
      const user: User = await prisma.user.create({
        data: { username, email, password: hashed, profile: profileVar, picture },
      });

      // --- GENERAR TOKEN JWT ---
      const token = generateToken({ id: user.id, email: user.email });

      const response: ApiResponse<{ user: User; token: string }> = {
        code: "000",
        message: "Operación realizada correctamente.",
        data: { user, token },
      };

      res.status(201).json(response);
    } catch (err) {
      console.error("Error en registro:", err);
      res.status(500).json({
        code: "500",
        message: "Error realizando operación.",
        data: null,
      });
    }
  },

  login: async (req: Request, res: Response) => {
    console.log("--> Login called: " + new Date().toLocaleString());
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user)
        return res
          .status(404)
          .json({
            code: "401",
            message: "Credenciales incorrectas.",
            data: null,
          });

      const valid = await comparePassword(password, user.password);
      if (!valid)
        return res
          .status(401)
          .json({
            code: "401",
            message: "Credenciales incorrectas.",
            data: null,
          });

      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        picture: user.picture,
      });

      const response: ApiResponse<{ user: User; token: string }> = {
        code: "000",
        message: "Operación realizada correctamente.",
        data: { user, token },
      };
      res.json(response);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({
          code: "500",
          message: "Error realizando operación.",
          data: null,
        });
    }
  },

  /**
   * ✅ Health check del backend y de la conexión a la base de datos
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    console.log("--> HealthCheck called: " + new Date().toLocaleString());
    try {
      await prisma.$queryRaw`SELECT 1`;

      const response: ApiResponse<HealthCheckData> = {
        code: "000",
        message: "Operación realizada correctamente.",
        data: {
          service: "Auth Service",
          status: "OK",
          database: "Connected",
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("❌ Error en healthCheck:", error);

      const response: ApiResponse<HealthCheckData> = {
        code: "500",
        message: "Error realizando operación.",
        data: {
          service: "Auth Service",
          status: "ERROR",
          database: "Disconnected",
          timestamp: new Date().toISOString(),
          error: (error as Error).message,
        },
      };

      res.status(500).json(response);
    }
  },
};
