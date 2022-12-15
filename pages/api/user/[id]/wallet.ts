import { Prisma, User, Wallet } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/client";
import tokenAuth from "../../../../utils/token-auth";

type Response = {
  msg: string;
};

async function getUser(
  userId: string | string[] | undefined,
  res: NextApiResponse
) {
  if (typeof userId == "string" && userId != undefined) {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    return user;
  } else {
    return null;
  }
}

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const method = req.method;
  const userId = req.query.id;

  switch (method) {
    case "GET":
      res.status(200);
      break;
    case "POST":
      const user = await getUser(userId, res);
      if (user) {
        let validated_body = Prisma.validator<Prisma.WalletCreateInput>()({
          ...req.body,
          userId: user.id,
        });
        try {
          await prisma.wallet.upsert({
            where: {
              address: req.body.address,
            },
            update: {
              userId: user.id,
            },
            create: validated_body,
          });
          res.status(201).json({ msg: "Wallet succesfully registered!" });
        } catch (e) {
          if (e instanceof Error) {
            res.status(400).json({ msg: e.message });
          }
        }
      } else {
        res.status(404);
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default async function handlerWithAuth(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  await tokenAuth(req, res, handler);
}
