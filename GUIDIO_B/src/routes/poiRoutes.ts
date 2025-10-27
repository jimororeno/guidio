import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { poiController } from "../controllers/poiController.js";


export const poiRouter = Router();

// Rutas públicas
poiRouter.get("/", poiController.getAllPOIs);
poiRouter.get("/find", poiController.findPOIs);
poiRouter.get("/:id", poiController.getPOIById);

// Rutas protegidas (solo administradores)
poiRouter.post("/", authMiddleware, adminOnly, poiController.createPOI);
poiRouter.put("/:id", authMiddleware, adminOnly, poiController.updatePOI);
poiRouter.delete("/soft/:id", authMiddleware, adminOnly, poiController.deleteSoftPOI);
poiRouter.delete("/:id", authMiddleware, adminOnly, poiController.deleteHardPOI);

