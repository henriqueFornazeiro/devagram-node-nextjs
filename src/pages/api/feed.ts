import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import { validateJWTToken } from "../../middlewares/validateJWTToken";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { UserModel } from "@/models/UserModel";
import { PublicationModel } from "@/models/PublicationModel";
import { FollowersModel } from "@/models/FollowersModel";
import { CORSPolicy } from "@/middlewares/CORSPolicy";

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
      } else {
        const { userId } = req.query;
        const userLogged = await UserModel.findById(userId);

        if (!userLogged) {
          return res.status(400).json({ error: "User not found" });
        }

        const following = await FollowersModel.find({ userId: userLogged._id });
        const followingId = following.map((s) => s.followedUserId);

        const publicationsHome = await PublicationModel.find({
          $or: [{ userId: userId }, { userId: followingId }],
        }).sort({ date: -1 });

        const result = [];
        for (const publication of publicationsHome) {
          const publicationUser = await UserModel.findById(publication.userId);
          if (publicationUser) {
            const final = {
              ...publication._doc,
              usuario: {
                name: publicationUser.name,
                avatar: publicationUser.avatar,
              },
            };
            result.push(final);
          }
        }

        return res.status(200).json(result);
      }

      return res.status(400).json({ error: "Could not get user data" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Could not get feed data: " + e });
  }
};

export default CORSPolicy(validateJWTToken(connectMongoDB(endpointFeed)));
