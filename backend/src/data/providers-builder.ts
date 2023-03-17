import { ethers } from "ethers";

/**
 * Creates a new provider to serve a request.
 */
export const getProvider = (): ethers.providers.Provider => {
    const rpcUrl = process.env.RPC_URL!;
    if (rpcUrl.startsWith("wss")) return new ethers.providers.WebSocketProvider(rpcUrl);
    return new ethers.providers.JsonRpcProvider(rpcUrl);
};
