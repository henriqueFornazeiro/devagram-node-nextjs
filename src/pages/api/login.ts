import type { NextApiRequest, NextApiResponse } from "next";
import type {standardAnswer} from "../../types/standardAnswer";
import {connectMongoDB} from "../../middlewares/connectMongoDB";
import { UserModel } from "../../models/UserModel";
import md5 from "md5";

const endpointLogin = async (req: NextApiRequest, res: NextApiResponse<standardAnswer>) => {
  if (req.method === "POST") {
    const {login, password} = req.body;

    const usersFound = await UserModel.find({email: login, password: md5(password) })

    if (usersFound && usersFound.length > 0) {
      const userFound = usersFound[0];
      return res
        .status(200)
        .json({ message: `User ${userFound.name} authenticated successfully` });
    }

    return res.status(400).json({ error: "User or password incorrect" });
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default connectMongoDB(endpointLogin);
