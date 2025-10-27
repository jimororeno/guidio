import express from "express";
import { contactController } from "../controllers/contactController.js";

export const contactRouter = express.Router();

// @desc    Enviar email de contacto
// @route   POST /api/contact
// @access  Public
contactRouter.post("/", contactController.sendContactEmail);


