import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { categoryController } from "../controllers/categoryController.js";

export const categoryRouter = Router();

// Rutas públicas
categoryRouter.get("/", categoryController.getAll);
categoryRouter.get("/find", categoryController.findByName);
categoryRouter.get("/tree", categoryController.getCategoryTree);
categoryRouter.get("/:id", categoryController.getById);


// Rutas protegidas (solo administradores)
categoryRouter.post("/", authMiddleware, adminOnly, categoryController.createCategory);
categoryRouter.put("/:id", authMiddleware, adminOnly, categoryController.updateCategory);
categoryRouter.delete("/soft/:id", authMiddleware, adminOnly, categoryController.deleteSoft);
categoryRouter.delete("/:id", authMiddleware, adminOnly, categoryController.deleteHard);

