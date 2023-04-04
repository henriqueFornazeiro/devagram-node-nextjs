import type { NextApiRequest, NextApiResponse } from "next";
import {validateJWTToken} from "../../middlewares/validateJWTToken";

const endpointUser = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json('Usuário autenticado');
}

export default validateJWTToken(endpointUser);


