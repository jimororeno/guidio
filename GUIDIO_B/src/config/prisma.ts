import { PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient({
    //log: ["query", "info", "warn", "error"] // <-- esto hace que veas todas las consultas SQL
});