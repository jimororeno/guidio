import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../types/response.js";

export const categoryController = {
  // GET ALL (sin protección)
  getAll: async (req: Request, res: Response) => {
    try {
      const categories = await prisma.category.findMany({
        where: {
          deletedAt: null, // ✅ Excluir eliminadas
        },
        include: {
          children: {
            where: { deletedAt: null }, // ✅ También excluir subcategorías eliminadas
          },
        },
        orderBy: { name: "asc" },
      });

      const response: ApiResponse<typeof categories> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: categories,
      };

      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // GET BY ID (sin protección)
  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const category = await prisma.category.findUnique({
        where: { id },
        include: { children: true },
      });

      const response: ApiResponse<typeof category> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: category,
      };

      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // FIND BY NAME (sin protección)
  findByName: async (req: Request, res: Response) => {
    try {
      const { name } = req.query;

      if (!name || String(name).trim() === "") {
        return res.status(400).json({
          code: "400",
          message: "Debe especificar un nombre de categoría para buscar.",
          data: null,
        });
      }

      const categories = await prisma.category.findMany({
        where: {
          deletedAt: null, // ✅ Excluir eliminadas
          name: {
            contains: String(name),
            mode: "insensitive",
          },
        },
        include: {
          children: {
            where: { deletedAt: null }, // ✅ También excluir subcategorías eliminadas
          },
        },
        orderBy: { name: "asc" },
      });

      const response: ApiResponse<typeof categories> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: categories,
      };

      res.json(response);
    } catch (error) {
      console.error("❌ Error en findByName:", error);
      res.status(500).json({
        code: "500",
        message: "Error realizando operación",
        data: null,
      });
    }
  },

  // CREATE (protegido)
  createCategory: async (req: Request, res: Response) => {
    try {
      const { name, parentId } = req.body;

      const category = await prisma.category.create({
        data: { name, parentId: parentId || null },
      });

      const response: ApiResponse<typeof category> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: category,
      };

      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // UPDATE (protegido)
  updateCategory: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { name, parentId } = req.body;

      const category = await prisma.category.update({
        where: { id },
        data: { name, parentId: parentId || null },
      });

      const response: ApiResponse<typeof category> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: category,
      };

      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // DELETE SOFT (protegido)
  deleteSoft: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const category = await prisma.category.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      const response: ApiResponse<typeof category> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: category,
      };

      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // DELETE HARD (protegido)
  deleteHard: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const category = await prisma.category.delete({ where: { id } });

      const response: ApiResponse<typeof category> = {
        code: "000",
        message: "Operación realizada correctamente",
        data: category,
      };

      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, message: "Error realizando operación", data: null });
    }
  },

  // GET CATEGORY TREE (sin protección)
  getCategoryTree: async (req: Request, res: Response) => {
    try {
      const categories = await prisma.category.findMany({
        where: {
          parentId: null, // Solo los padres raíz
          deletedAt: null, // No eliminadas
        },
        include: {
          children: {
            where: { deletedAt: null },
            include: {
              children: {
                where: { deletedAt: null },
                include: {
                  children: {
                    where: { deletedAt: null },
                  },
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      });

      const response: ApiResponse<typeof categories> = {
        code: "000",
        message: "Árbol de categorías obtenido correctamente",
        data: categories,
      };

      res.json(response);
    } catch (error) {
      console.error("❌ Error al obtener árbol de categorías:", error);
      res.status(500).json({
        code: "500",
        message: "Error al obtener el árbol de categorías",
        data: null,
      });
    }
  },
};
