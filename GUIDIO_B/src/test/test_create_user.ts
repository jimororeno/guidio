import { prisma } from "../config/prisma.js"; // ESM requiere la extensión .js
import { hashPassword } from "../utils/auth.js";

async function main() {
  const hashed = await hashPassword("password");

  const user = await prisma.user.create({
    data: {
      username: "jimoreno",
      email: "jimoreno@hotmail.es",
      password: hashed,
      profile: "admin",
      picture: "https://example.com/avatar.jpg",
    },
  });

  const usersData = await Promise.all(
    Array.from({ length: 10 }, async (_, i) => ({
      username: `User${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: await hashPassword(`password${i + 1}`),
      profile: i % 2 === 0 ? "user" : "editor",
      picture: `https://example.com/avatar${i + 1}.jpg`,
    }))
  );

  for (const data of usersData) {
    const user = await prisma.user.create({ data });
    console.log("✅ Usuario creado:", user.username);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
