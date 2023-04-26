import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { validateJWTToken } from "@/middlewares/validateJWTToken";
import { UserModel } from "@/models/UserModel";
import { FollowersModel } from "@/models/FollowersModel";
import { CORSPolicy } from "@/middlewares/CORSPolicy";

const endpointFollow = async (req: NextApiRequest, res: NextApiResponse<standardAnswer>) => {
  try {
    if (req.method === "PUT") {
      const { userId, id } = req?.query;

      const userLogged = await UserModel.findById(userId);

      if (!userLogged) {
        return res.status(400).json({ error: "User logged not found." });
      }

      const userToBeFollowed = await UserModel.findById(id);

      if (!userToBeFollowed) {
        return res.status(400).json({ error: "User to be follwed not found." });
      }

      const checkAlreadyFollow = await FollowersModel.find({
        userId : userId,
        followedUserId : id
      });

      if(checkAlreadyFollow && checkAlreadyFollow.length > 0){

        checkAlreadyFollow.forEach(async(element:any) => await FollowersModel.findByIdAndDelete({_id:element._id}));
        
        userLogged.following --;
        await UserModel.findByIdAndUpdate({_id : userLogged._id},userLogged);

        userToBeFollowed.followers --;
        await UserModel.findByIdAndUpdate({_id : userToBeFollowed._id},userToBeFollowed);

        return res.status(200).json({ message: "User unfollowed successfully" });

      }else{
        const follow = {
            userId : userId,
            followedUserId : id
        }

        await FollowersModel.create(follow);

        userLogged.following ++;
        await UserModel.findByIdAndUpdate({_id : userLogged._id},userLogged);

        userToBeFollowed.followers ++;
        await UserModel.findByIdAndUpdate({_id : userToBeFollowed._id},userToBeFollowed);

        return res.status(200).json({ message: "User followed successfully" });
      }

    }

    return res.status(405).json({ error: "Method not allowed." });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: "Unable to follow or unfollow; Verify: " + e });
  }
};

export default CORSPolicy(validateJWTToken(connectMongoDB(endpointFollow)));
