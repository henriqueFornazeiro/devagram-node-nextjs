import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { validateJWTToken } from "@/middlewares/validateJWTToken";
import { PublicationModel } from "@/models/PublicationModel";
import { UserModel } from "@/models/UserModel";

const endpointLike = async (req: NextApiRequest, res: NextApiResponse<standardAnswer>) => {
  try {
    if (req.method === "PUT") {
      //id da publicação
      const { id } = req?.query;
      const publication = await PublicationModel.findById(id);

      if (!publication) {
        return res.status(400).json({ error: "Publication not found" });
      }

      const { userId } = req?.query;
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const userLikedPostIndex = publication.likes.findIndex(
        (e: any) => e.toString() === user._id.toString()
      );

      if (userLikedPostIndex != -1) {
        publication.likes.splice(userLikedPostIndex, 1);

        await PublicationModel.findByIdAndUpdate(
          { _id: publication._id },
          publication
        );

        return res.status(200).json({ message: "Successfully disliked post" });

      } else {
        publication.likes.push(user._id);

        await PublicationModel.findByIdAndUpdate(
          { _id: publication._id },
          publication
        );

        return res.status(200).json({ message: "Successfully liked post" });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: "There was an error trying to like or dislike a post" });
  }
};

export default validateJWTToken(connectMongoDB(endpointLike));
