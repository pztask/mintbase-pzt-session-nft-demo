import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../../prisma/client";

async function getWallet(
  walletAddress: string | string[] | undefined,
  userId: string | string[] | undefined
) {
  if (typeof walletAddress == "string" && typeof userId == "string") {
    const user = await prisma.wallet.findUnique({
      where: {
        address: walletAddress,
      },
    });
    return user;
  } else {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const walletAddress = req.query.address;
  const userId = req.query.id;

  let wallet;
  switch (method) {
    case "GET":
      wallet = await getWallet(walletAddress, userId);
      if (wallet) {
        if (typeof userId == "string" && wallet.userId == parseInt(userId)) {
          res.status(200).end();
        } else {
          res.status(404).end();
        }
      } else {
        res.status(404).end();
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
