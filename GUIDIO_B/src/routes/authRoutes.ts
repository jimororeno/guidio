import { Router } from "express";
import { authController } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get('/health', authController.healthCheck); // Ruta para el chequeo de salud
