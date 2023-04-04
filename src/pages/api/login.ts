import type { NextApiRequest, NextApiResponse } from "next";
import type {standardAnswer} from "../../types/standardAnswer";
import type {loginResponse} from "../../types/loginResponse";
import {connectMongoDB} from "../../middlewares/connectMongoDB";
import { UserModel } from "../../models/UserModel";
import md5 from "md5";
import jwt from 'jsonwebtoken';

const endpointLogin = async (req: NextApiRequest, res: NextApiResponse<standardAnswer | loginResponse >) => {

  const {KEY_JWT} = process.env;

  if(!KEY_JWT){
    return res
        .status(500)
        .json({ error: "Configuration error in .env file" });
  }

  if (req.method === "POST") {
    const {login, password} = req.body;

    const usersFound = await UserModel.find({email: login, password: md5(password) })

    if (usersFound && usersFound.length > 0) {
      const userFound = usersFound[0];

      const token = jwt.sign({_id: userFound._id}, KEY_JWT)

      return res
        .status(200)
        .json({ name: userFound.name, email: userFound.email, token});
    }

    return res.status(400).json({ error: "User or password incorrect" });
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default connectMongoDB(endpointLogin);
