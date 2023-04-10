import { prismaMock } from "../../prisma/singleton";
import { hashPass } from "../../utils/password-hash";
import { checkCredentials } from "../../pages/api/auth/[...nextauth]";

describe("checkCredentials", () => {
  beforeEach(async () => {
    const user = {
      id: 1,
      email: "john.doe@example.com",
      encrypted_password: await hashPass("password"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
  });

  test("Succesfully check user credentials", async () => {
    const result = await checkCredentials({
      email: "john.doe@example.com",
      password: "password",
    });

    expect(result).toBe({ email: "john.doe@example.com", id: 1 });
  });

  test("Fail to check user", async () => {
    const result = await checkCredentials({
      email: "john.doe@example.com",
      password: "wrong_password",
    });

    expect(result).toBe(null);
  });
});
