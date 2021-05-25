import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Users } from "../../../db/models/Users.model";

export const auth = async (req: Request, res:Response, next: NextFunction) => {
    try {
        if(req.headers?.authorization) {
            const token = req.headers.authorization.replace('Bearer ','');
            const decryptedToken : any = jwt.verify(token,process.env.JWT_SECRET as string);
            const user = await Users.findOne({where:{email:decryptedToken.id, token:token}});
            if(!user){
                throw Error();
            }
            req.body.authenticated_user_obj = user;
            req.body.authenticated_user_token = token;
            next();
        } else {
            throw Error();
        }
    } catch (e) {
        res.status(401).send('Authentication failed');
    }
}