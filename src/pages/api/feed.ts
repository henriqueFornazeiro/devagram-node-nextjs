import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import { validateJWTToken } from "../../middlewares/validateJWTToken";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { UserModel } from "@/models/UserModel";
import { PublicationModel } from "@/models/PublicationModel";

const endpointFeed = async (
  req: NextApiRequest,
  res: NextApiResponse<standardAnswer | any>
) => {
  try {
    if (req.method === "GET") {
      
      if (req?.query?.id) {
        
        const user = await UserModel.findById(req?.query?.id);

        if (!user) {
          return res.status(400).json({ error: "User not found" });
        }

        const publications = await PublicationModel.find({
          userId: user._id,
        }).sort({ date: -1 });

        return res.status(200).json(publications);
      }

      return res.status(400).json({ error: "Could not get user data" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Could not get feed data: "+e });
  }

  
};

export default validateJWTToken(connectMongoDB(endpointFeed));
