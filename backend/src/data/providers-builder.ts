import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";

interface IChainProvider {
    id: string;
    name: string;
    rpc_url: () => string;
}

export enum Chains {
    Polygon = "137",
    Mumbai = "80001"
}

/**
 * The chains currently supported by the Dottyland backend
 */
export const supportedChains: { [chain: string]: IChainProvider } = {
    [Chains.Polygon]: {
        id: "137",
        name: "Polygon",
        rpc_url: () => process.env.POLYGON_RPC!
    },
    [Chains.Mumbai]: {
        id: "80001",
        name: "Mumbai",
        rpc_url: () => process.env.MUMBAI_RPC!
    }
};

/**
 * Creates a new provider to serve a request.
 * @dev providers are cheap to create and have problems if kept alive too long.
 * Don't be scared to create new ones.
 * @param chainId The chain the provider should be connected to.
 */
export const getProvider = (chainId: string): ethers.providers.Provider => {
    const chainInfo = supportedChains[chainId];
    if (!chainInfo) throw new Error(`Chain ${chainId} does not seem to be supported`);
    return instantiateProvider(chainInfo.rpc_url());
};

const instantiateProvider = (rpcUrl: string): BaseProvider => {
    if (rpcUrl.startsWith("wss")) return new ethers.providers.WebSocketProvider(rpcUrl);
    return new ethers.providers.JsonRpcProvider(rpcUrl);
};
