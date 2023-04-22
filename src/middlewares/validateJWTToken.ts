import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { standardAnswer } from "../types/standardAnswer";
import jwt, { JwtPayload } from "jsonwebtoken";

export const validateJWTToken =
  (handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse<standardAnswer>) => {

    try{
      const { KEY_JWT } = process.env;

      if (!KEY_JWT) {
        return res
          .status(500)
          .json({ error: "Configuration error in .env file" });
      }
  
      if (!req || !req.headers) {
        return res.status(401).json({ error: "Access token is not valid" });
      }
  
      if (req.method != "OPTIONS") {
        const authorization = req.headers["authorization"];
  
        if (!authorization) {
          return res.status(401).json({ error: "Access token is not valid" });
        }
  
        const token = authorization.substring(7);
  
        if (!token) {
          return res.status(401).json({ error: "Access token is not valid" });
        }
  
        const decoded = jwt.verify(token, KEY_JWT) as JwtPayload;
  
        if (!decoded) {
          return res.status(401).json({ error: "Access token is not valid" });
        }
  
        if (!req.query) {
          req.query = {};
        }
  
        req.query.userId = decoded._id;
      }
    }catch(e){
      console.log(e);
      return res.status(401).json({ error: "Access token is not valid" });
    }

    return handler(req, res);

  };
