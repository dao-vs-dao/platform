import { ethers, providers, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { ICoords } from "../@types/i-coords";
import { IGame } from "../@types/i-game";
import { BNToPOJOPlayer, IPlayer } from "../@types/i-player";
import { DaoVsDaoAbi } from "./abis/dao-vs-dao";
import { bigNumberToFloat } from "./big-number-to-float";

const POLYGON_DVD_ADDRESS = "0xAcd88F72B980ed144c7C037F6807E39026CFFd15";
const MUMBAI_DVD_ADDRESS = "0xAcd88F72B980ed144c7C037F6807E39026CFFd15";
const getContractAddress = () => (true ? MUMBAI_DVD_ADDRESS : POLYGON_DVD_ADDRESS);

const zeroAddress = "0x0000000000000000000000000000000000000000";

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
        console.error(error);
        return null;
    }
};

/**
 * Claim the accrued tokens.
 * @dev Should be wrapped in trycatch and a promise toast.
 */
export const claimTokens = async (signer: Signer): Promise<void> => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, signer);
    const tx = await daoVsDao.claimTokens();
    await tx.wait();
};

/**
 * Adds the user to the game
 * @dev Should be wrapped in trycatch and a promise toast.
 * @param signer The signer that will be used to trigger the tx.
 * @param coords The point in which the user wants to start.
 * @param referrer The player that referred this user.
 */
export const placeUser = async (
    signer: Signer,
    coords: ICoords,
    referrer?: string
): Promise<void> => {
    referrer = referrer ?? zeroAddress;
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, signer);
    const participationFee = await daoVsDao.participationFee();

    const tx = await daoVsDao.placeUser(coords, referrer, { value: participationFee });
    await tx.wait();
};

/**
 * Retrieve the current participation fee
 */
export const fetchParticipationFee = async (provider: providers.Provider): Promise<number> => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, provider);
    const participationFee = await daoVsDao.participationFee();
    return bigNumberToFloat(participationFee);
};

/**
 * Move the player to the selected coordinates, swapping its content.
 * @param signer The signer that will be used to trigger the tx.
 * @param coords The point to swap to.
 */
export const swap = async (
    signer: Signer,
    coords: ICoords,
) => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, signer);
    const tx = await daoVsDao.swap(coords);
    await tx.wait();
}

/**
 * Trigger a sponsoring tx.
 * @param signer The signer that will be used to trigger the tx.
 * @param user The user the sponsoring will be directed to.
 * @param amount The sponsored amount.
 */
export const sponsor = async (
    signer: Signer,
    user: string,
    amount: number
) => {
    const daoVsDao = new ethers.Contract(getContractAddress(), DaoVsDaoAbi, signer);
    const tx = await daoVsDao.sponsor(user, parseEther(amount.toString()));
    await tx.wait();
}
