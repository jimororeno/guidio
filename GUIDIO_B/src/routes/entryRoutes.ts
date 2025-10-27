import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { entryController } from "../controllers/entryController.js";



export const entryRouter = Router();

// Públicos
entryRouter.get("/", entryController.getAllPOIEntries);
entryRouter.get("/find", entryController.findPOIEntries);
entryRouter.get("/:id", entryController.getPOIEntryById);

// Protegidos (usuario autenticado)
entryRouter.post("/", authMiddleware, entryController.createPOIEntry);
entryRouter.put("/:id", authMiddleware, entryController.updatePOIEntry);

// Solo admin
entryRouter.delete("/soft/:id", authMiddleware, adminOnly, entryController.deletePOIEntrySoft);
entryRouter.delete("/hard/:id", authMiddleware, adminOnly, entryController.deletePOIEntryHard);

