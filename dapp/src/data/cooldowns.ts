import { IPlayer } from "../@types/i-player";

/** Check whether the user's attack cool-down is active */
export const hasAttackCoolDown = (player: IPlayer) =>
    Date.now() < player.attackCoolDownEndTimestamp;

/** Check whether the user's recovery cool-down is active */
export const hasRecoveryCoolDown = (player: IPlayer) =>
Date.now() < player.recoveryCoolDownEndTimestamp;

/** Given a future timestamp, it returns a string representation of the time left */
export const timeLeft = (timestamp: number): string => {
    const difference = timestamp - Date.now();
    if (difference <= 0) return "00:00:00";

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
};
