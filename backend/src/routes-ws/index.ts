import { subDays, subHours } from "date-fns";
import { Request } from "express";
import * as ws from "ws";

import { IMessage } from "../@types/message";
import { getNeighboringAddresses } from "../data/dao-vs-dao-contract";
import { Message } from "../models/message";

const openSockets: { [address: string]: ws } = {};

/**
 * Endpoint to establish a WSS connection with the client,
 * used to exchange end-to-end encrypted messages with other users.
 * @dev MUST be authenticated first, by using the `isAuthenticatedWs` middleware.
 */
export const authenticatedMessagesWs = async (ws: ws, req: Request) => {
    // store connection
    const userAddress = req.user!.address;
    openSockets[userAddress] = ws;

    try {
        // delete all old messages
        const yesterday = subDays(new Date(), 2);
        await Message.deleteMany({ date: { $lte: yesterday } });

        // retrieve and send user's messages
        const neighbors = await getNeighboringAddresses(userAddress);
        const messages = await Message.find({
            $or: [
                { to: userAddress, from: { $in: neighbors } },
                { from: userAddress, to: { $in: neighbors } }
            ]
        }).sort({ date: 1 });

        ws.send(JSON.stringify(messages));
    } catch (error) {
        const unexpectedErrorMessage = getSystemMessage(
            userAddress,
            "Something went wrong while fetching your messages. Let us know and we will investigate!"
        );
        ws.send(JSON.stringify([unexpectedErrorMessage]));
        console.error({ error });
    }

    ws.onmessage = async (event) => {
        try {
            const newMessage = JSON.parse(event.data.toString());
            delete newMessage["date"];
            const message = await Message.build(newMessage).save();

            // check user quota
            const messageCount = await Message.countDocuments({ from: userAddress });
            if (messageCount >= 200) {
                const quotaReachedMessage = getSystemMessage(
                    message.from,
                    "YOU'VE REACHED YOUR QUOTA. WAIT TO SEND MORE MESSAGES"
                );
                ws.send(JSON.stringify([quotaReachedMessage]));
                return;
            }

            // echo the message
            ws.send(JSON.stringify([message]));

            // if user is online (they have an open socket) and a neighbor, we send them the message
            const userSocket = openSockets[message.to];
            if (!userSocket) return;
            const currentNeighbors = new Set(await getNeighboringAddresses(userAddress));
            if (!currentNeighbors.has(message.to)) return;

            userSocket.send(JSON.stringify([message]));
        } catch (error) {
            console.error({ error, event });
        }
    };

    ws.onclose = (event) => {
        delete openSockets[userAddress];
    };
};

const getSystemMessage = (to: string, text: string): IMessage => ({
    from: "0x0000000000000000000000000000000000000000",
    to,
    date: new Date(),
    message: text,
    read: false
});
