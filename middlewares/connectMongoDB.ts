import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import type {standardAnswer} from "../types/standardAnswer";

export const connectMongoDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<standardAnswer>) => {
    //verifica se já está conectado
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    //se não estiver conectado
    const { DB_CONNECTION_STRING } = process.env;

    if (!DB_CONNECTION_STRING) {
      return res
        .status(500)
        .json({ error: "Configuration error in .env file" });
    }

    mongoose.connection.on("connected", () =>
      console.log("Connected with the database successfully")
    );

    mongoose.connection.on("error", (error) =>
      console.log(`Connection error ${error}`)
    );

    await mongoose.connect(DB_CONNECTION_STRING);

    //segue para o endpoint, após a conexão
    return handler(req,res)
  };
