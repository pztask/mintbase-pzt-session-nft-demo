import { PrismaClient } from "@prisma/client";
import { hashPass } from "../utils/password-hash";

const prisma = new PrismaClient();

async function main() {
  const john_doe = await prisma.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      email: "john.doe@example.com",
      encrypted_password: await hashPass("password1"),
    },
  });
  const jane_doe = await prisma.user.upsert({
    where: { email: "jane.doe@example.com" },
    update: {},
    create: {
      email: "jane.doe@example.com",
      encrypted_password: await hashPass("password1"),
    },
  });
  console.log({ john_doe, jane_doe });
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
