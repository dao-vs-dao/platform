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

    // retrieve and send user's messages
    const neighbors = new Set(await getNeighboringAddresses(userAddress));
    const toMessages = await Message.find({ to: userAddress, from: { $in: neighbors } });
    const fromMessages = await Message.find({ from: userAddress, to: { $in: neighbors } });
    ws.send(JSON.stringify([...toMessages, ...fromMessages]));

    ws.onmessage = async (event) => {
        const newMessage: IMessage = JSON.parse(event.data.toString());
        await Message.build(newMessage).save();

        // if user is online (they have an open socket) and a neighbor, we send them the message
        const userSocket = openSockets[newMessage.to];
        if (!userSocket) return;
        const currentNeighbors = new Set(await getNeighboringAddresses(userAddress));
        if (currentNeighbors.has(newMessage.to)) return;

        userSocket.send(JSON.stringify([newMessage]));
    };

    ws.onclose = (event) => {
        delete openSockets[userAddress];
    };
};
