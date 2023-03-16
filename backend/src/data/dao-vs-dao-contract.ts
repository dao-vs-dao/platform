import { ethers } from "ethers";

import { DaoVsDaoAbi } from "./ABIs/dao-vs-dao";
import { getProvider, Chains } from "./providers-builder";

const getDVDContract = (): ethers.Contract => {
    const isProduction = process.env.INSTANCE_TYPE === "production";
    const provider = getProvider(isProduction ? Chains.Polygon : Chains.Mumbai);
    return new ethers.Contract(process.env.DVD_ADDRESS!, DaoVsDaoAbi, provider);
};

export const getNeighboringAddresses = async (address: string): Promise<string[]> => {
    const dvd = getDVDContract();
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const neighbors: string[] = await dvd.getNeighboringAddresses(address);
    return neighbors.filter((address) => address !== zeroAddress);
};
