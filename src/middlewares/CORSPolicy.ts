import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type {standardAnswer} from "../types/standardAnswer";
import NextCors from "nextjs-cors";

export const CORSPolicy =  (handler:NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse<standardAnswer> )=>{
        try {
            await NextCors(req, res, {
                origin: "*",
                method: ["GET", "POST", "PUT"],
                optionSuccessStatus: 200
            });

            return handler(req,res);
        } catch (e) {
            console.log(e);
            return res.status(500).json({error: "Error occurred while handling color policy"})
        }
    }