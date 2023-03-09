import { Prisma, User, Wallet } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/client";
import tokenAuth from "../../../../utils/token-auth";

type GenericResponse = {
  msg: string;
};

async function getUser(userId: string | string[] | undefined) {
  if (typeof userId == "string") {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      include: {
        wallet: true,
      },
    });
    return user;
  } else {
    return null;
  }
}

async function deleteWallet(
  user: User & {
    wallet: Wallet | null;
  }
) {
  if (user.wallet) {
    await prisma.wallet.delete({
      where: {
        userId: user.id,
      },
    });
  }
}

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenericResponse | Wallet>
) {
  const method = req.method;
  const userId = req.query.id;

  let user;
  switch (method) {
    case "GET":
      user = await getUser(userId);
      if (user && user.wallet) {
        res.status(200).json(user.wallet);
      } else {
        res.status(404).end();
      }
      break;
    case "POST":
      user = await getUser(userId);
      if (user) {
        let validated_body = Prisma.validator<Prisma.WalletCreateInput>()({
          ...(typeof req.body === "string" ? JSON.parse(req.body) : req.body),
          userId: user.id,
        });
        try {
          // TODO: Check if wallet exists first!
          await deleteWallet(user);

          await prisma.wallet.upsert({
            where: {
              address: (typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body
              ).address,
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
        res.status(404).end();
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
