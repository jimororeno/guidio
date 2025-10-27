import { prisma } from "../config/prisma.js"; // ESM requiere la extensión .js

async function main() {
  const now = new Date();

  const categoriesData = [
    {
      name: "🏛️ Arquitectura y edificios",
      children: ["EDIFICIO", "PALACIO", "CASTILLO", "CASA HISTÓRICA", "MANSIÓN", "TORRE", "PUENTE"],
    },
    {
      name: "⛪ Religioso",
      children: ["IGLESIA", "CATEDRAL", "MONASTERIO", "TEMPLO"],
    },
    {
      name: "🎨 Arte y monumentos",
      children: ["ESTATUA", "MONUMENTO", "OBRA DE ARTE", "MURAL", "ESCULTURA"],
    },
    {
      name: "🏞️ Naturaleza y espacios abiertos",
      children: ["PARQUE", "JARDÍN", "PLAZA", "MIRADOR", "LAGO", "RÍO"],
    },
    {
      name: "🏺 Museos y cultura",
      children: ["MUSEO", "GALERÍA", "CENTRO CULTURAL", "SITIO HISTÓRICO"],
    },
    {
      name: "⚓ Transporte y puntos emblemáticos",
      children: ["ESTACIÓN", "PUERTO", "FARO"],
    },
    {
      name: "🛍️ Comercial y ocio",
      children: ["MERCADO", "PLAZA COMERCIAL", "CAFÉ HISTÓRICO", "BAR", "RESTAURANTE"],
    },
  ];

  for (const category of categoriesData) {
    const parent = await prisma.category.create({
      data: {
        name: category.name,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    });
    console.log("✅ Categoría principal creada:", parent.name);

    for (const childName of category.children) {
      const child = await prisma.category.create({
        data: {
          name: childName,
          parentId: parent.id,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
      });
      console.log("   - Subcategoría creada:", child.name);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
