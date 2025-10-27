import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../types/response.js";

export const entryController = {
  // Crear POIEntry
  createPOIEntry: async (req: Request, res: Response) => {
    try {
      const { poiId, userId, language, rate, content } = req.body;
      const entry = await prisma.entry.create({
        data: {
          poiId,
          userId,
          language,
          rate,
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const response: ApiResponse<typeof entry> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: entry,
      };
      res.json(response);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // Obtener todos
  getAllPOIEntries: async (req: Request, res: Response) => {
    try {
      const entries = await prisma.entry.findMany({
        where: { deletedAt: null },
        include: { poi: true, user: true },
      });
      const response: ApiResponse<typeof entries> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: entries,
      };
      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // Obtener por ID
  getPOIEntryById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const entry = await prisma.entry.findUnique({
        where: { id: Number(id) },
        include: { poi: true, user: true },
      });
      const response: ApiResponse<typeof entry> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: entry,
      };
      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // Actualizar
  updatePOIEntry: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { poiId, language, rate, content } = req.body;

      const entry = await prisma.entry.update({
        where: { id: Number(id) },
        data: {
          poiId,
          language,
          rate,
          content,
          updatedAt: new Date(),
        },
      });

      const response: ApiResponse<typeof entry> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: entry,
      };
      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // Delete soft
  deletePOIEntrySoft: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const entry = await prisma.entry.update({
        where: { id: Number(id) },
        data: { deletedAt: new Date() },
      });

      const response: ApiResponse<typeof entry> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: entry,
      };
      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // Delete hard
  deletePOIEntryHard: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const entry = await prisma.entry.delete({
        where: { id: Number(id) },
      });

      const response: ApiResponse<typeof entry> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: entry,
      };
      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // Find con filtros y ordenación
  findPOIEntries: async (req: Request, res: Response) => {
    try {
      const { poiId, userId, language, orderBy, orderDirection } = req.query;

      let order: any = {};
      if (orderBy) {
        order[orderBy as string] = orderDirection === "desc" ? "desc" : "asc";
      }

      const entries = await prisma.entry.findMany({
        where: {
          deletedAt: null,
          poiId: poiId ? Number(poiId) : undefined,
          userId: userId ? Number(userId) : undefined,
          language: language ? String(language) : undefined,
        },
        orderBy: orderBy ? order : undefined,
        include: { poi: true, user: true },
      });

      const response: ApiResponse<typeof entries> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: entries,
      };
      res.json(response);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },
};
