import { PrismaClient } from "@prisma/client";
import { hashPass } from "../utils/password-hash";

const prisma = new PrismaClient();

async function main() {
  const test_user = await prisma.user.upsert({
    where: { email: "test.user@example.com" },
    update: {},
    create: {
      email: "test.user@example.com",
      encrypted_password: await hashPass("dummy_password"),
    },
  });
  console.log({ test_user });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
