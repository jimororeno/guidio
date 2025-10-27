import { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ApiResponse } from "../types/response";
import { sendEmail } from "./emailController";

dotenv.config();

interface ContactRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactController = {
  sendContactEmail: async (
    req: Request<{}, {}, ContactRequestBody>,
    res: Response
  ) => {
    console.log("SendContactEmail called: " + new Date().toLocaleString());
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios." });
      }

      if (message.length > 1000) {
        return res
          .status(400)
          .json({ message: "El mensaje no puede superar 1000 caracteres." });
      }

      // // Configurar transporter
      // const transporter = nodemailer.createTransport({
      //   host: process.env.EMAIL_HOST,
      //   port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
      //   secure: process.env.EMAIL_PORT === "465", // true para 465, false para otros
      //   auth: {
      //     user: process.env.EMAIL_USER!,
      //     pass: process.env.EMAIL_PASS!,
      //   },
      // });

      // Contenido del email
      const mailOptions = {
        to: process.env.ADMIN_EMAIL!,
        subject: `[Contacto] ${subject}`,
        htmlContent: `<p><strong>Nombre:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Asunto:</strong> ${subject}</p>
               <p><strong>Mensaje:</strong><br/>${message}</p>`,
      };
      // Enviar email
      await sendEmail(mailOptions);

      const response: ApiResponse<any> = {
        code: "000",
        message: "Email enviado correctamente",
        data: null,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error("Error enviando email de contacto:", error);
      res
        .status(500)
        .json({ code: "500", message: "Error al enviar el mensaje." });
    }
  },
};
