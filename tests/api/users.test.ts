import { createMocks } from "node-mocks-http";
import signinHandler from "../../pages/api/auth/old_signin";

describe("/api/auth/signin", () => {
  test("signin user", async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {
        email: "john.doe@example.com",
      },
    });

    await signinHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        name: "John Doe",
      })
    );
  });

  test("use not allowed method", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await signinHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
