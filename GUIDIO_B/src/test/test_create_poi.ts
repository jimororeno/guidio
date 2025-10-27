import { prisma } from "../config/prisma.js";

// Coordenadas aproximadas del centro de Mérida
const MERIDA_CENTER = { lat: 38.917, lng: -6.345 };
const MERIDA_RADIUS = 0.01; // ±0.01 grados ~1 km

// Genera un número aleatorio entre min y max
function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

async function main() {
  // Obtener todas las categorías activas
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
  });

  if (categories.length === 0) {
    console.error("❌ No hay categorías activas. Crea algunas antes de ejecutar este test.");
    return;
  }

  const poiNames = [
    "Teatro Romano", "Anfiteatro", "Templo de Diana", "Catedral",
    "Museo Nacional", "Puente Romano", "Alcazaba", "Plaza Mayor",
    "Estatua de Trajano", "Mansión histórica", "Parque de las Siete Sillas",
    "Jardín Botánico", "Monumento a los Eméritos", "Mural histórico",
    "Escultura urbana", "Centro Cultural Alcazaba", "Mirador del río Guadiana",
    "Lago de Proserpina", "Casa Histórica", "Torre de Bujaco",
    "Palacio del Gobernador", "Faro del Guadiana", "Estación de tren",
    "Café histórico", "Mercado central", "Galería de arte", "Sitio histórico",
    "Templo romano", "Puente de Albarregas"
  ];

  for (let i = 0; i < poiNames.length; i++) {
    // Elegir categoría aleatoria
    const category = categories[Math.floor(Math.random() * categories.length)];

    const users = await prisma.user.findMany({ where: { deletedAt: null } });
    const user = users[Math.floor(Math.random() * users.length)];

   

    // Crear POI
    const poi = await prisma.poi.create({
      data: {
        name: poiNames[i],
        categoryId: category.id,
        userId: user.id,
        latitude: randomInRange(MERIDA_CENTER.lat - MERIDA_RADIUS, MERIDA_CENTER.lat + MERIDA_RADIUS),
        longitude: randomInRange(MERIDA_CENTER.lng - MERIDA_RADIUS, MERIDA_CENTER.lng + MERIDA_RADIUS),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`✅ POI creado: ${poi.name} (Categoría: ${category.name})`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
