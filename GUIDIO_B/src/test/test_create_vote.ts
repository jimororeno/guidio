import { prisma } from "../config/prisma.js";

async function main() {
  const now = new Date();

  // Obtener todos los usuarios y todas las entradas
  const users = await prisma.user.findMany({ where: { deletedAt: null } });
  const entries = await prisma.entry.findMany({ where: { deletedAt: null } });

  if (users.length === 0 || entries.length === 0) {
    console.error(
      "❌ Necesitas tener usuarios y poi entries creados antes de ejecutar este test."
    );
    return;
  }

  const votesData = [];

  // Generar votos aleatorios
  for (const entry of entries) {
    // Genera un array de -1 y +1
    const possibleVotes = [-1, 1];

    // Elegir un número aleatorio de votos entre 1 y 3, por ejemplo
    const numVotes = Math.floor(Math.random() * 3) + 1;

    // Mezclar usuarios y tomar los primeros `numVotes`
    const shuffledUsers = users
      .sort(() => 0.5 - Math.random())
      .slice(0, numVotes);

    for (const user of shuffledUsers) {
      const value =
        possibleVotes[Math.floor(Math.random() * possibleVotes.length)];
      votesData.push({
        entryId: entry.id,
        userId: user.id,
        value,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  for (const data of votesData) {
    try {
      const vote = await prisma.vote.create({ data });
      console.log(
        `✅ Voto creado: Entry ${vote.entryId} - User ${vote.userId} - Value ${vote.value}`
      );
    } catch (error: any) {
      if (error.code === "P2002") {
        console.warn(
          `⚠️ El usuario ${data.userId} ya votó la entrada ${data.entryId}`
        );
      } else {
        console.error(error);
      }
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
