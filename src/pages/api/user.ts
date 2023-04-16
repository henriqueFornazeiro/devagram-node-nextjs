import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import { validateJWTToken } from "../../middlewares/validateJWTToken";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { UserModel } from "@/models/UserModel";
import nc from "next-connect";
import { upload, uploadImageCosmic } from "../../../services/uploadImageCosmic";

const handler = nc()
  .use(upload.single("file"))
  .put(async (req: any, res: NextApiResponse<standardAnswer>) => {
    try {
      const { userId } = req.query;

      const user = await UserModel.findById(userId);

      if(!user){
        return res.status(400).json({ error: "User not found" });
      }

      const {name} = req.body;

      if(name && name.lenght > 2){
        user.name = name;

      }

      const {file} = req;

      if(file && file.originalname){
        const image = await uploadImageCosmic(req)
        user.avatar = file
      }



    } catch (error) {
      console.log(error);
    }

    return res.status(400).json({ error: "Could not get user data" });
  });

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
    return res.status(400).json({ error: "Could not get user data" });
  }
};

export default validateJWTToken(connectMongoDB(endpointUser));
