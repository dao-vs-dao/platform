export interface IPlayer {
    address: string;
    balance: number;
    claimable: number;
    sponsorships: number;
}

export const compactAddress = (address: string): string => `${address.substring(37)}`;

export const shortenAddress = (address: string): string =>
    `${address.substring(0, 7)}...${address.substring(37)}`;

export const roundAtFifthDecimal = (n: number) => Math.round(n * 100000) / 100000;

export const getWorth = (player: IPlayer) =>
    roundAtFifthDecimal(player.balance + player.claimable + player.sponsorships);
