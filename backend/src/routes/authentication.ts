import express, { Request, Response } from "express";
import passport from "passport";
import { utils } from "ethers";
import { param, validationResult } from "express-validator";

import { makeOTP } from "../authentication/OTP-maker";
import { composeMessage } from "../authentication/passport";

export const authRouter = express.Router();

authRouter.get(
    "/message-to-sign/:address",
    param("address").isEthereumAddress(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const address = utils.getAddress(req.params.address);
        const otp = makeOTP(address);
        const message = composeMessage(address, otp);
        return res.json({ message });
    }
);

authRouter.post("/login", passport.authenticate("web3"), (req: Request, res: Response) => {
    res.sendStatus(200);
});

authRouter.get("/logged-user", (req: Request, res: Response) => {
    res.json(req.user ?? {});
});

authRouter.post("/logout", (req: Request, res: Response) => {
    req.logout(() => {
        /** Do nothing */
    });
    res.sendStatus(200);
});
