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

  const jane_doe_wallet = await prisma.wallet.upsert({
    where: { address: "dummy_address" },
    update: {},
    create: {
      address: "dummy_address",
      userId: jane_doe.id,
    },
  });

  console.log({ john_doe, jane_doe, jane_doe_wallet });
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
