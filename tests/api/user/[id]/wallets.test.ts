import { createMocks } from "node-mocks-http";
import { prismaMock } from "../../../../prisma/singleton";
import { handler } from "../../../../pages/api/user/[id]/wallet";

describe("/api/user/[id]/wallet", () => {
  beforeEach(async () => {
    const user = {
      id: 999,
      email: "test.user@example.com",
      encrypted_password: "dummy_hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wallet = {
      id: 999,
      address: "dummy_address",
      userId: 999,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.wallet.upsert.mockResolvedValue(wallet);
  });

  test("Successful register a new wallet for a user", async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {
        id: "999",
      },
      body: {
        address: "test_wallet_address",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        msg: "Wallet succesfully registered!",
      })
    );
  });

  test("Failed register a wallet with bad payload", async () => {
    prismaMock.wallet.upsert.mockRejectedValue(new Error("Failed to upsert!"));

    const { req, res } = createMocks({
      method: "POST",
      query: {
        id: "999",
      },
      body: {
        something: 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        msg: "Failed to upsert!",
      })
    );
  });

  test("Failed register a wallet for a non existing user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const { req, res } = createMocks({
      method: "POST",
      query: {
        id: "888",
      },
      body: {
        address: "test_wallet_address",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });
});
