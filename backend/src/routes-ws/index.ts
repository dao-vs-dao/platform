import { subDays, subHours } from "date-fns";
import { Request } from "express";
import * as ws from "ws";

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

    // delete all old messages
    const yesterday = subDays(new Date(), 1);
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

    ws.onmessage = async (event) => {
        try {
            const newMessage = JSON.parse(event.data.toString());
            delete newMessage["date"];
            const message = await Message.build(newMessage).save();

            // echo the message
            ws.send(JSON.stringify([message]))

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
