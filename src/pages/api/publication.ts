import type { NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import nc from "next-connect";
import { upload, uploadImageCosmic } from "../../services/uploadImageCosmic";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { validateJWTToken } from "../../middlewares/validateJWTToken";
import { PublicationModel } from "../../models/PublicationModel";
import { UserModel } from "../../models/UserModel";
import { CORSPolicy } from "@/middlewares/CORSPolicy";

const handler = nc()
  .use(upload.single("file"))
  .post(async (req: any, res: NextApiResponse<standardAnswer>) => {
    try {
      const { userId } = req.query;

      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      if (!req || !req.body) {
        return res.status(400).json({ error: "Missing input parameters" });
      }

      const { description } = req?.body;

      if (!description || description.length < 2) {
        return res.status(400).json({ error: "Description is not valid" });
      }

      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ error: "Image is required" });
      }

      const image = await uploadImageCosmic(req);

      const post = {
        userId: user._id,
        description,
        image: image.media.url,
        date: new Date(),
      };

      user.publications ++;
      await UserModel.findByIdAndUpdate({_id : user._id}, user);
      
      await PublicationModel.create(post);

      return res.status(200).json({ message: "Post has been saved" });

    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: "Post has not been saved" });
    }

  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default CORSPolicy(validateJWTToken(connectMongoDB(handler)));
