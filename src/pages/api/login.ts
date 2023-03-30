import type {NextApiRequest, NextApiResponse} from 'next'

export default (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if(req.method === "POST"){
        const {login, senha} = req.body;

        if(login === "admin@admin.com" && senha === "123"){
            return res.status(200).json({error: "User authenticated successfully"});
        }
        
        return res.status(400).json({error: "User or password incorrect"});

    }

    return res.status(405).json({error: "Method not allowed"});
}