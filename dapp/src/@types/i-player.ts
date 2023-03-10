import { bigNumberToFloat } from "../data/big-number-to-float";
import { coordsFromBigNumber, ICoords } from "./i-coords";

export interface IPlayer {
    userAddress: string;
    coords: ICoords;
    balance: number;
    sponsorships: number;
    claimable: number;
}

/** The worth of the player (balance + sponsorships + claimable) */
export const calculateWorth = (player: IPlayer) =>
    player.balance + player.sponsorships + player.claimable;

export const BNToPOJOPlayer = (player: any) =>
    ({
        userAddress: player.userAddress,
        coords: coordsFromBigNumber(player.coords),
        balance: bigNumberToFloat(player.balance, 5),
        sponsorships: bigNumberToFloat(player.sponsorships, 5),
        claimable: bigNumberToFloat(player.claimable, 5),
    } as IPlayer);
