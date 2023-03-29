import { bigNumberToFloat } from "../data/big-number-to-float";
import { roundAtFifthDecimal } from "../data/utils";
import { BNToPOJOCoords, ICoords } from "./i-coords";

export interface IPlayer {
    userAddress: string;
    coords: ICoords;
    balance: number;
    sponsorships: number;
    claimable: number;
    attackCoolDownEndTimestamp: number;
    recoveryCoolDownEndTimestamp: number;
}

/** The worth of the player (balance + sponsorships + claimable) */
export const calculateWorth = (player: IPlayer) =>
    roundAtFifthDecimal(player.balance + player.sponsorships + player.claimable);

/** Given a BigNumber-represented player, it returns a POJO version of it */
export const BNToPOJOPlayer = (player: any) =>
    ({
        userAddress: player.userAddress,
        coords: BNToPOJOCoords(player.coords),
        balance: bigNumberToFloat(player.balance, 5),
        sponsorships: bigNumberToFloat(player.sponsorships, 5),
        claimable: bigNumberToFloat(player.claimable, 5),
        attackCoolDownEndTimestamp: player.attackCoolDownEndTimestamp.toNumber() * 1000,
        recoveryCoolDownEndTimestamp: player.recoveryCoolDownEndTimestamp.toNumber() * 1000
    } as IPlayer);
