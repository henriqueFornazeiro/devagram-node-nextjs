import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import type { registrationRequest } from "../../types/registrationRequest";
import { UserModel } from "../../models/UserModel";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import md5 from "md5";

const endpointCreate = async (
  req: NextApiRequest,
  res: NextApiResponse<standardAnswer>
) => {
  if (req.method === "POST") {
    const user = req.body as registrationRequest;

    if (!user.name || user.name.length < 2) {
      return res.status(400).json({ error: "Name isn't valid" });
    }

    if (
      !user.email ||
      user.email.length < 5 ||
      !user.email.includes("@") ||
      !user.email.includes(".")
    ) {
        return res.status(400).json({ error: "E-mail isn't valid" });
    }

    if (!user.password || user.password.length < 4) {
        return res.status(400).json({ error: "Password isn't valid" });
    }

    const userExists = await UserModel.find({ email: user.email });

    if(userExists && userExists.length>0){
        return res.status(400).json({ error: "User already exists" });
    }

    const userToSave = {
      name: user.name,
      email: user.email,
      password: md5(user.password),
    };

    await UserModel.create(userToSave);
    return res.status(200).json({ message: "User created successfully" });
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default connectMongoDB(endpointCreate);
