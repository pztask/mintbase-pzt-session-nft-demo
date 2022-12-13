import { checkCredentials } from "../../pages/api/auth/[...nextauth]";

describe("checkCredentials", () => {
  test("Succesfully check user credentials", async () => {
    const result = await checkCredentials({
      email: "john.doe@example.com",
      password: "password1",
    });

    expect(result).toBe("john.doe@example.com");
  });

  test("Fail to check user", async () => {
    const result = await checkCredentials({
      email: "john.doe@example.com",
      password: "wrong_password",
    });

    expect(result).toBe(null);
  });
});
