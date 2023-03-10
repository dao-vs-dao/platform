import { ethers, providers, Signer } from "ethers";
import { coordsFromBigNumber } from "../@types/i-coords";
import { IGame } from "../@types/i-game";
import { BNToPOJOPlayer, IPlayer } from "../@types/i-player";
import { DaoVsDaoAbi } from "./abis/dao-vs-dao";

const POLYGON_DVD_ADDRESS = "0xAcd88F72B980ed144c7C037F6807E39026CFFd15";
const MUMBAI_DVD_ADDRESS = "0xAcd88F72B980ed144c7C037F6807E39026CFFd15";
const getContractAddress = () => (true ? MUMBAI_DVD_ADDRESS : POLYGON_DVD_ADDRESS);

/**
 * Fetch the global state of the game
 */
export const fetchGameData = async (provider: providers.Provider): Promise<IGame> => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, provider);
    const gameData = await daoVsDao.getGameData();
    return { lands: gameData.lands, players: gameData.players.map(BNToPOJOPlayer) };
};

/**
 * Fetch information about the specified player.
 * @dev it will return `undefined` if the address doesn't belong to a player.
 */
export const fetchPlayerData = async (
    provider: providers.Provider,
    walletAddress: string
): Promise<IPlayer | null> => {
    try {
        const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, provider);
        const player = await daoVsDao.getPlayerData(walletAddress);
        return BNToPOJOPlayer(player);
    } catch (error) {
        return null;
    }
};
