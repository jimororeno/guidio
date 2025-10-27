// src/services/emailService.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
}: EmailData): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"No Reply" <noreply@example.com>',
      to,
      subject,
      html: htmlContent,
    });
    
  } catch (error) {
    console.error(`❌ Error al enviar correo a ${to}:`, error);
    throw new Error("Error al enviar el correo electrónico.");
  }
};
