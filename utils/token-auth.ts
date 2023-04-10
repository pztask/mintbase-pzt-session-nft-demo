// This is an example of how to read a JSON Web Token from an API route
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

interface Handler {
  (req: NextApiRequest, res: NextApiResponse): Promise<void>;
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
  handler: Handler
) {
  const token = await getToken({ req });

  if (token) {
    await handler(req, res);
  } else {
    res.status(401);
  }
  res.end();
}
