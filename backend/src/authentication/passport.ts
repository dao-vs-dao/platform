import { Request } from "express";
import passport from "passport";
import { utils } from "ethers";
import passportCustom from "passport-custom";
import { SignatureLike } from "@ethersproject/bytes";

import { IUser } from "../@types/user";
import { IUserDocument, User } from "../models/user";
import { makeOTP } from "../authentication/OTP-maker";

export const composeMessage = (userAddress: string, otp: string): string =>
    `Sign this message to verify you own the address ${userAddress}. \n\n[OTP: ${otp}]`;

const verifyMessage = (
    address: string,
    signedMessage: SignatureLike,
    previous: boolean = false
): boolean => {
    try {
        const otp = makeOTP(address, previous);
        const message = composeMessage(address, otp);
        const decodedAddress = utils.verifyMessage(message, signedMessage);
        return address === decodedAddress;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const verifySignedMessage = (address: string, signedMessage: SignatureLike) =>
    verifyMessage(address, signedMessage) || verifyMessage(address, signedMessage, true);

const findOrCreateUser = async (req: Request, callback: (err: any, user?: IUser) => void) => {
    try {
        const signedMessage = req.body.signedMessage;
        const address = utils.getAddress(req.body.userAddress);

        if (!verifySignedMessage(address, signedMessage)) {
            return callback("Invalid signature");
        }

        // fetch or create user
        const user = await User.findOneOrCreate(address);

        return callback(null, user);
    } catch (error) {
        return callback(error);
    }
};

passport.use("web3", new passportCustom.Strategy(findOrCreateUser));

passport.serializeUser((user: any, cb: (err: any, user?: IUser) => void) => {
    cb(null, user._id);
});

passport.deserializeUser((id: any, cb: (err: any, user?: IUser) => void) => {
    User.findById(id, (err: any, user: IUserDocument) => {
        cb(err, user);
    });
});
