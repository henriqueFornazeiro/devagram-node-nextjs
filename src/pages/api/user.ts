import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import { validateJWTToken } from "../../middlewares/validateJWTToken";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { UserModel } from "@/models/UserModel";

const endpointUser = async (
  req: NextApiRequest,
  res: NextApiResponse<standardAnswer | any>
) => {
  try {
    const { userId } = req?.query;
    const user = await UserModel.findById(userId);

    user.password = null;

    return res.status(200).json(user);
    
  } catch (e) {
    console.log(e);
    return res.status(400).json({error:"Could not get user data"});
  }
};

export default validateJWTToken(connectMongoDB(endpointUser));
