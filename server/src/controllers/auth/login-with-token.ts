import { Account } from "../../models/Account";
import { signToken } from "../../middlewares/jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

export const loginWithToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth: JwtPayload = req.body.auth;
        const email: string = auth['email'];

        const account = await Account.findOne({ 'email': email });

        if (account) {
            res.status(200).json({
                "message": "success",
                "user": "account successfully logged in",
            })
        }

        // // Get account from DB, existance not verified because we are already authorized at this point
        // const foundAccount = await Account.findOne({ _id: uid }).select('-password')

        // // Generate access token
        // const token = signToken({ uid: foundAccount._id, role: foundAccount.role })

        res.status(200).json({
            message: 'Account fetched'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json()
    }
}