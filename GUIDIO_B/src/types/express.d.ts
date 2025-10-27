import { User } from "@prisma/client"; // tu modelo de Prisma

declare global {
  namespace Express {
    interface Request {
      user?: User; // opcional porque puede no estar autenticado
    }
  }
}
