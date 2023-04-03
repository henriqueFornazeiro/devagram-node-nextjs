import type { NextApiRequest, NextApiResponse } from "next";
import type {standardAnswer} from "../../../types/standardAnswer";
import {connectMongoDB} from "../../../middlewares/connectMongoDB";

const endpointLogin = (req: NextApiRequest, res: NextApiResponse<standardAnswer>) => {
  if (req.method === "POST") {
    const { login, senha } = req.body;

    if (login === "admin@admin.com" && senha === "123") {
      return res
        .status(200)
        .json({ message: "User authenticated successfully" });
    }

    return res.status(400).json({ error: "User or password incorrect" });
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default connectMongoDB(endpointLogin);
