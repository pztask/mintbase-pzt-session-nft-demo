import { hashPass, checkPass } from "../../utils/password-hash";

describe("password-hash", () => {
  test("Hash password and successfully check it", async () => {
    const hash = await hashPass("dummy_password");

    const result = await checkPass("dummy_password", hash);

    expect(result).toBe(true);
  });

  test("Hash password and fail to check it", async () => {
    const hash = await hashPass("dummy_password");

    const result = await checkPass("wrong_password", hash);

    expect(result).toBe(false);
  });
});
