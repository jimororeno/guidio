import { prisma } from "../config/prisma.js"; // ESM requiere extensión .js

async function main() {
  const users = await prisma.user.findMany({ where: { deletedAt: null } });
  const pois = await prisma.poi.findMany({ where: { deletedAt: null } });
  const languages = ["ES", "EN", "FR", "DE"];

  if (users.length === 0 || pois.length === 0) {
    console.error("❌ Necesitas tener usuarios y POIs existentes para ejecutar este test.");
    return;
  }

  // Generar 50 POIEntry
  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPOI = pois[Math.floor(Math.random() * pois.length)];
    const randomLang = languages[Math.floor(Math.random() * languages.length)];
    const randomRate = Math.floor(Math.random() * 5) + 1; // 1 a 5
    const comment = `Comentario de prueba #${i + 1}`;

    const entry = await prisma.entry.create({
      data: {
        poiId: randomPOI.id,
        userId: randomUser.id,
        language: randomLang,
        rate: randomRate,
        content: comment,        // ⚠️ Obligatorio
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(
      `✅ POIEntry creado: ${entry.id} (User: ${randomUser.username}, POI: ${randomPOI.name}, Lang: ${randomLang}, Rate: ${randomRate})`
    );
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
