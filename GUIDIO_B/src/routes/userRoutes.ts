import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { userController } from "../controllers/userController.js";

export const usersRouter = Router();

// Rutas públicas o protegidas
usersRouter.get("/", authMiddleware, userController.getAllUsers);
usersRouter.get("/filter", authMiddleware, userController.getFilteredUsers);
usersRouter.post('/forgot-password', userController.requestPasswordReset); 
usersRouter.post('/reset-password', userController.resetPassword);  
usersRouter.get("/:id", authMiddleware, userController.getUserById);
    

// Rutas protegidas
usersRouter.post("/", authMiddleware, userController.createUser);
usersRouter.put("/change-password", authMiddleware, userController.changePassword);
usersRouter.put("/:id", authMiddleware, upload.single("picture"), userController.updateUser);
usersRouter.delete("/soft/:id", authMiddleware, userController.deleteSoftUser);
usersRouter.delete("/:id", authMiddleware, userController.deleteHardUser);

