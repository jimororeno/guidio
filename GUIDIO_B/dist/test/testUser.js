import { prisma } from "../config/prisma";
async function main() {
    const user = await prisma.user.create({
        data: {
            username: "Juan Pérez",
            email: "juan@example.com",
            password: "1234",
            profile: "user",
            picture: "https://example.com/avatar.jpg",
        },
    });
    console.log("✅ Usuario creado:", user);
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
