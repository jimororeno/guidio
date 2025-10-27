import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../types/response.js";

export const voteController = {

// GET ALL
getAll : async (req: Request, res: Response) => {
  try {
    const votes = await prisma.vote.findMany({
      where: { deletedAt: null },
    });
    const response: ApiResponse<typeof votes> = {
      code: "000",
      message: "Operación realizada correctamente",
      data: votes,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ code: 500, message: "Error realizando operación", data: null });
  }
},

// GET BY ID
getById : async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vote = await prisma.vote.findUnique({
      where: { id: Number(id) },
    });
    const response: ApiResponse<typeof vote> = {
      code: "000",
      message: "Operación realizada correctamente",
      data: vote,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ code: 500, message: "Error realizando operación", data: null });
  }
},

// CREATE
create : async (req: Request, res: Response) => {
  try {
    const { entryId, userId, value } = req.body;
    const vote = await prisma.vote.create({
      data: {
        entryId,
        userId,
        value,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const response: ApiResponse<typeof vote> = {
      code: "000",
      message: "Operación realizada correctamente",
      data: vote,
    };
    res.json(response);
  } catch (error: any) {
    // Posible violación de unique constraint
    if (error.code === "P2002") {
      return res.status(400).json({ code: 400, message: "El usuario ya ha votado esta entrada", data: null });
    }
    res.status(500).json({ code: 500, message: "Error realizando operación", data: null });
  }
},

// UPDATE
update : async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const vote = await prisma.vote.update({
      where: { id: Number(id) },
      data: { value, updatedAt: new Date() },
    });
    const response: ApiResponse<typeof vote> = {
      code: "000",
      message: "Operación realizada correctamente",
      data: vote,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ code: 500, message: "Error realizando operación", data: null });
  }
},

// DELETE SOFT
deleteSoft : async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vote = await prisma.vote.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
    const response: ApiResponse<typeof vote> = {
      code: "000",
      message: "Operación realizada correctamente",
      data: vote,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ code: 500, message: "Error realizando operación", data: null });
  }
},

// DELETE HARD
deleteHard : async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vote = await prisma.vote.delete({
      where: { id: Number(id) },
    });
    const response: ApiResponse<typeof vote> = {
      code: "000",
      message: "Operación realizada correctamente",
      data: vote,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ code: 500, message: "Error realizando operación", data: null });
  }
},

// FIND con filtros y ordenación
find : async (req: Request, res: Response) => {
  try {
    const { poiEntryId, userId, value, orderBy, orderDir } = req.query;

    const where: any = { deletedAt: null };
    if (poiEntryId) where.poiEntryId = Number(poiEntryId);
    if (userId) where.userId = Number(userId);
    if (value) where.value = Number(value);

    const order: any = {};
    if (orderBy) {
      order[String(orderBy)] = orderDir === "desc" ? "desc" : "asc";
    }

    const votes = await prisma.vote.findMany({
      where,
      orderBy: orderBy ? order : undefined,
    });

    const response: ApiResponse<typeof votes> = {
      code: "000",
      message: "Operación realizada correctamente",
      data: votes,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ code: 500, message: "Error realizando operación", data: null });
  }
},

};
