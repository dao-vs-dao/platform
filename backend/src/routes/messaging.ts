import express, { Request, Response } from "express";
import { param, validationResult } from "express-validator";

import { isAuthenticated } from "../middlewares/authentication";
import { Message } from "../models/message";

export const messagingRouter = express.Router();

messagingRouter.post(
    "/set-read/:thread",
    param("thread").isEthereumAddress(),
    isAuthenticated,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const to = req.user!.address;
        const from = req.params.thread;

        // set the whole tread as read
        await Message.updateMany({ to, from }, { $set: { read: true } });
        return res.sendStatus(200);
    }
);
