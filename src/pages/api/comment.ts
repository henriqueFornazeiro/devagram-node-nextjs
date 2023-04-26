import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import { validateJWTToken } from "@/middlewares/validateJWTToken";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { UserModel } from "@/models/UserModel";
import { PublicationModel } from "@/models/PublicationModel";
import { CORSPolicy } from "@/middlewares/CORSPolicy";

const endpointComment = async (
  req: NextApiRequest,
  res: NextApiResponse<standardAnswer>
) => {
  try {
    //qual método http?
    if (req.method === "PUT") {
      const { userId, id } = req?.query;
      const userLogged = await UserModel.findById(userId);

      if (!userLogged) {
        return res.status(400).json({ error: "User not found" });
      }

      const publication = await PublicationModel.findById(id);

      if (!publication) {
        return res.status(400).json({ error: "Publication not found" });
      }
      
      if (!req.body || !req.body.comment || req.body.comment.length < 2) {
        return res.status(400).json({ error: "Comment is not valid" });
      }
      
      const comment = {
        userId: userLogged._id,
        name: userLogged.name,
        avatar: userLogged.avatar,
        comment: req.body.comment
      }

      publication.comments.push(comment);

      await PublicationModel.findByIdAndUpdate({_id:publication._id}, publication);

      return res.status(200).json({message:"Comment posted successfully"});

    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Error while adding comment: " + e });
  }
};

export default CORSPolicy(validateJWTToken(connectMongoDB(endpointComment)));
