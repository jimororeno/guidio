import { prisma } from "../config/prisma";
import { Request, Response } from "express";
import { ApiResponse } from "../types/response";

export const poiController = {

// Crear un POI
createPOI :async (req: Request, res: Response) => {
  try {
    const { name, description, userId, categoryId, latitude, longitude } =
      req.body;

    const poi = await prisma.poi.create({
      data: {
        name,
        description,
        userId,
        categoryId,
        latitude,
        longitude,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const response: ApiResponse<typeof poi> = {
      code: "000",
      message: "Operación realizada correctamente",
      data: poi,
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ code: "500", message: "Error realizando operación", data: null });
  }
},

// Actualizar POI
// Actualizar POI y opcionalmente la ubicación
updatePOI:async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, latitude, longitude } = req.body;

    // Buscar el POI existente
    const existingPOI = await prisma.poi.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPOI) {
      return res
        .status(404)
        .json({ code: "404", message: "POI no encontrado", data: null });
    }

    // Actualizar el POI
    const poi = await prisma.poi.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        categoryId,
        latitude,
        longitude,
        updatedAt: new Date(),
      },
    });

    res.json({
      code: "000",
      message: "Operación realizada correctamente",
      data: poi,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ code: "500", message: "Error realizando operación", data: null });
  }
},

// Borrado soft
deleteSoftPOI: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poi = await prisma.poi.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });
    res.json({
      code: "000",
      message: "Operación realizada correctamente",
      data: poi,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ code: "500", message: "Error realizando operación", data: null });
  }
},

// Borrado hard
deleteHardPOI: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poi = await prisma.poi.delete({ where: { id: parseInt(id) } });
    res.json({
      code: "000",
      message: "Operación realizada correctamente",
      data: poi,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ code: "500", message: "Error realizando operación", data: null });
  }
},

// Obtener todos los POIs activos
getAllPOIs: async (req: Request, res: Response) => {
  try {
    const pois = await prisma.poi.findMany({
      where: { deletedAt: null },
    });
    res.json({
      code: "000",
      message: "Operación realizada correctamente",
      data: pois,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ code: "500", message: "Error realizando operación", data: null });
  }
},

// Obtener POI por ID
getPOIById: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poi = await prisma.poi.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });
    res.json({
      code: "000",
      message: "Operación realizada correctamente",
      data: poi,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ code: "500", message: "Error realizando operación", data: null });
  }
},

// Buscar POIs por filtros: nombre, tipo (categoría), ubicación (lat, lng, radius)
findPOIs : async (req: Request, res: Response) => {
  try {
    const { name, categoryId, lat, lng, radius } = req.query;

    const where: any = { deletedAt: null };

    if (name) where.name = { contains: String(name), mode: "insensitive" };
    if (categoryId) where.categoryId = parseInt(String(categoryId));
    if (lat && lng && radius) {
      const r = parseFloat(String(radius));
      const latitude = parseFloat(String(lat));
      const longitude = parseFloat(String(lng));
      where.location = {
        latitude: { gte: latitude - r, lte: latitude + r },
        longitude: { gte: longitude - r, lte: longitude + r },
      };
    }

    const pois = await prisma.poi.findMany({
      where,
    });

    res.json({
      code: "000",
      message: "Operación realizada correctamente",
      data: pois,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ code: "500", message: "Error realizando operación", data: null });
  }
},

};