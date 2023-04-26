import type { NextApiRequest, NextApiResponse } from "next";
import type { standardAnswer } from "../../types/standardAnswer";
import type { registrationRequest } from "../../types/registrationRequest";
import { UserModel } from "../../models/UserModel";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import md5 from "md5";  
import { upload, uploadImageCosmic } from "../../services/uploadImageCosmic";
import nc from "next-connect";
import { CORSPolicy } from "@/middlewares/CORSPolicy";

const handler = nc()
  .use(upload.single('file'))
  .post(

  async (
    req: NextApiRequest,
    res: NextApiResponse<standardAnswer>
  ) => {

    try{
      const user = req.body as registrationRequest;
  
      if (!user.name || user.name.length < 2) {
        return res.status(400).json({ error: "Name isn't valid" });
      }
  
      if (
        !user.email ||
        user.email.length < 5 ||
        !user.email.includes("@") ||
        !user.email.includes(".")
      ) {
          return res.status(400).json({ error: "E-mail isn't valid" });
      }
  
      if (!user.password || user.password.length < 4) {
          return res.status(400).json({ error: "Password isn't valid" });
      }
  
      const userExists = await UserModel.find({ email: user.email });
  
      if(userExists && userExists.length>0){
          return res.status(400).json({ error: "User already exists" });
      }

      //send image of multer to cosmicjs
      const image = await uploadImageCosmic(req)
  
      //save user to database
      const userToSave = {
        name: user.name,
        email: user.email,
        avatar: image?.media?.url,
        password: md5(user.password)
      };
  
      await UserModel.create(userToSave);
      return res.status(200).json({ message: "User created successfully" });

    }catch(e){

      console.log(e);
      return res.status(500).json({ error: "Error to save user" });

    }    
    
  }

)

export const config = {
  api:{
    bodyParser:false
  }
}

export default CORSPolicy(connectMongoDB(handler));
