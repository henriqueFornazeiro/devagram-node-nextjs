import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { validateJWTToken } from "@/middlewares/validateJWTToken";
import { UserModel } from "@/models/UserModel";

const endpointSearch = async (
  req: NextApiRequest,
  res: NextApiResponse<standardAnswer | any[]>
) => {
  try {
    if (req.method === "GET") {
      const { filter } = req.query;

      if (!filter || filter.length < 2) {
        return res
          .status(400)
          .json({
            error: "Please enter more than 2 characters for the search",
          });
      }

      const usersFound = await UserModel.find({
        name: { $regex: filter, $options: "i" },
      });

      return res.status(200).json(usersFound);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Unable to search user: " + e });
  }
};

export default validateJWTToken(connectMongoDB(endpointSearch));
