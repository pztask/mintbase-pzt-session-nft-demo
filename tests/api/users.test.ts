import { createMocks } from "node-mocks-http";
import authHandler from "../../pages/api/auth/[...nextauth]";

describe("/api/auth/signin", () => {
  test("signin user 2", async () => {
    const { req, res } = createMocks({
      method: "POST",
      url: "/api/auth/callback/credentials",
      query: {
        email: "john.doe@example.com",
      },
      headers: {
        host: "localhost",
      },
    });

    await authHandler(req, res);

    expect(res._getStatusCode()).toBe(302);
    // TODO: Continue here
    // expect(JSON.parse(res._getData())).toEqual(
    //   expect.objectContaining({
    //     name: "John Doe",
    //   })
    // );
  });
});
