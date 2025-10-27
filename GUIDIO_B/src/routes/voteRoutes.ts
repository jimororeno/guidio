import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js"; // Protege solo creación, update, delete
import { voteController } from "../controllers/voteController.js";

export const voteRouter = Router();

// Rutas públicas
voteRouter.get("/", voteController.getAll);
voteRouter.get("/find", voteController.find);
voteRouter.get("/:id", voteController.getById);

// Rutas protegidas
voteRouter.post("/", authMiddleware, voteController.create);
voteRouter.put("/:id", authMiddleware, voteController.update);
voteRouter.delete("/soft/:id", authMiddleware, voteController.deleteSoft);
voteRouter.delete("/hard/:id", authMiddleware, voteController.deleteHard);

