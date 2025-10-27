// controllers/userController.ts
import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { sendEmail } from "./emailController.js";

export const userController = {
  // 🔹 GET: obtener todos los usuarios
  getAllUsers: async (_req: Request, res: Response) => {
    console.log("--> getAllUsers called: " + new Date().toLocaleString());
    try {
      const users = await prisma.user.findMany();
      res.json({ code: "000", message: "OK", data: users });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ code: "500", message: "Error al obtener usuarios." });
    }
  },

  // 🔹 GET: obtener usuario por ID
  getUserById: async (req: Request, res: Response) => {
    console.log("--> getUserById called: " + new Date().toLocaleString());
    const id = Number(req.params.id);
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user)
        return res
          .status(404)
          .json({ code: "404", message: "Usuario no encontrado." });
      res.json({ code: "000", message: "OK", data: user });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ code: "500", message: "Error al obtener usuario." });
    }
  },

  // 🔹 POST: crear usuario con imagen
  createUser: async (req: Request, res: Response) => {
    console.log("--> createUser called: " + new Date().toLocaleString());
    try {
      const { username, email, password, profile } = req.body;
      const picture = req.file
        ? `uploads/images/${req.file.filename}`
        : undefined; // ruta pública

      const newUser = await prisma.user.create({
        data: { username, email, password, profile, picture },
      });

      res.status(201).json({
        code: "000",
        message: "Usuario creado correctamente.",
        data: newUser,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ code: "500", message: "Error al crear usuario." });
    }
  },

  // 🔹 PUT: actualizar usuario con posible nueva imagen
  updateUser: async (req: Request, res: Response) => {
    console.log("--> updateUser called: " + new Date().toLocaleString());
    const id = Number(req.params.id);
    try {
      const { username, email, profile, bio } = req.body;
      const picture = req.file
        ? `uploads/images/${req.file.filename}`
        : undefined;

      // --- VALIDACIÓN DE CAMPOS ---
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          code: "400",
          message: "El formato del correo electrónico no es válido.",
          data: null,
        });
      }

      
      // Verificar si ya existe un usuario con ese email o username
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({
          code: "409",
          message: "El correo o nombre de usuario ya está registrado.",
          data: null,
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { username, email, profile, bio,  ...(picture && { picture }) },
      });

      res.json({
        code: "000",
        message: "Usuario actualizado correctamente.",
        data: updatedUser,
      });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ code: "500", message: "Error al actualizar usuario." });
    }
  },

  // 🔹 DELETE soft
  deleteSoftUser: async (req: Request, res: Response) => {
    console.log("--> deleteSoftUser called: " + new Date().toLocaleString());
    const id = Number(req.params.id);
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      res.json({
        code: "000",
        message: "Usuario eliminado (soft).",
        data: user,
      });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ code: "500", message: "Error al eliminar usuario." });
    }
  },

  // 🔹 DELETE hard
  deleteHardUser: async (req: Request, res: Response) => {
    console.log("--> deleteHardUser called: " + new Date().toLocaleString());
    const id = Number(req.params.id);
    try {
      const user = await prisma.user.delete({ where: { id } });
      res.json({
        code: "000",
        message: "Usuario eliminado definitivamente.",
        data: user,
      });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ code: "500", message: "Error al eliminar usuario." });
    }
  },

  // 🔹 GET filtrado
  getFilteredUsers: async (req: Request, res: Response) => {
    console.log("--> getFilteredUsers called: " + new Date().toLocaleString());
    const { username, email, orderBy, order } = req.query;
    try {
      const users = await prisma.user.findMany({
        where: {
          username: username
            ? { contains: String(username), mode: "insensitive" }
            : undefined,
          email: email
            ? { contains: String(email), mode: "insensitive" }
            : undefined,
        },
        orderBy: orderBy ? { [String(orderBy)]: order ?? "asc" } : undefined,
      });
      res.json({ code: "000", message: "OK", data: users });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ code: "500", message: "Error al filtrar usuarios." });
    }
  },

  // 🔹 Cambiar contraseña del usuario autenticado
  changePassword: async (req: Request, res: Response) => {
    console.log("--> changePassword called: " + new Date().toLocaleString());
    const userId = req.user?.id; // asegúrate de que tu middleware JWT agrega req.user
    console.log("User ID for password change:", userId);
    const { currentPassword, newPassword } = req.body;
    console.log("Request body:", req.body);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        code: "400",
        message: "Ambas contraseñas son requeridas.",
        data: null,
      });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user)
        return res
          .status(404)
          .json({ code: "500", message: "Usuario no encontrado.", data: null });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(401).json({
          code: "401",
          message: "Contraseña actual incorrecta.",
          data: null,
        });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return res.status(200).json({
        code: "200",
        message: "Contraseña actualizada correctamente.",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        code: "500",
        message: "Error al cambiar la contraseña.",
        data: null,
      });
    }
  },

  // 🔹 Solicitar restablecimiento de contraseña
  requestPasswordReset: async (req: Request, res: Response) => {
    console.log(
      "--> requestPasswordReset called: " + new Date().toLocaleString()
    );
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requerido." });

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      // Siempre respondemos OK para no revelar si el email existe
      if (!user) {
        return res.status(200).json({
          code: "200",
          message:
            "Si el correo existe, se ha enviado un enlace de restablecimiento.",
          data: null,
        });
      }

      // Eliminar tokens antiguos
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      // Crear nuevo token
      const resetToken = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt,
        },
      });

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const emailContent = `
        <h2>Restablecimiento de Contraseña</h2>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p><a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a></p>
        <p>Este enlace expira en 1 hora.</p>
      `;

      await sendEmail({
        to: user.email,
        subject: "Restablecimiento de contraseña",
        htmlContent: emailContent,
      });

      res.status(200).json({
        code: "200",
        message:
          "Si el correo existe, se ha enviado un enlace de restablecimiento.",
        data: null,
      });
    } catch (error) {
      console.error("Error en solicitud de restablecimiento:", error);
      res
        .status(500)
        .json({ code: "500", message: "Error interno del servidor." });
    }
  },

  // 🔹 Restablecer contraseña usando token
  resetPassword: async (req: Request, res: Response) => {
    console.log("--> resetPassword called: " + new Date().toLocaleString());
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({
          code: 400,
          message: "Token y nueva contraseña requeridos.",
          data: null,
        });
    }

    try {
      const resetRecord = await prisma.passwordResetToken.findUnique({
        where: { token },
      });

      if (!resetRecord || resetRecord.expiresAt < new Date()) {
        if (resetRecord)
          await prisma.passwordResetToken.delete({ where: { token } });
        return res
          .status(400)
          .json({
            code: 400,
            message: "Token inválido o expirado.",
            data: null,
          });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      });

      // Eliminar token usado
      await prisma.passwordResetToken.delete({ where: { token } });

      res
        .status(200)
        .json({
          code: 200,
          message: "Contraseña restablecida correctamente.",
          data: null,
        });
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      res
        .status(500)
        .json({
          code: 500,
          message: "Error interno del servidor.",
          data: null,
        });
    }
  },
};
