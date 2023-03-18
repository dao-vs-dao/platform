import { BigNumber } from "ethers";

export interface ICoords {
    realm: number;
    row: number;
    column: number;
}

export const coordsFromBigNumber = (coords: {
    realm: BigNumber;
    row: BigNumber;
    column: BigNumber;
}) => ({
    realm: coords.realm.toNumber(),
    row: coords.row.toNumber(),
    column: coords.column.toNumber()
});

export const coordsFromLooseValues = (realm: number, row: number, column: number) => ({
    realm,
    row,
    column
});

export const coordToString = (coord: ICoords) => `${coord.realm}-${coord.row}-${coord.column}`;

export const looseCoordToString = (realm: number, row: number, column: number) =>
    `${realm}-${row}-${column}`;

/**
 * Check whether a pair of coordinates is neighboring.
 */
export const areNeighboring = (c1: ICoords, c2: ICoords) => {
    if (c1.realm !== c2.realm) return false;
    if (Math.abs(c1.row - c2.row) > 1) return false;
    if (Math.abs(c1.column - c2.column) > 1) return false;
    return true;
};

/**
 * Check whether a player in the first set of coordinate can swap
 * with a player in the second set.
 */
export const canSwap = (c1: ICoords, c2: ICoords) => {
    if (c1.realm !== c2.realm) return false;
    if (c1.row < c2.row) return false;
    if (Math.abs(c1.column - c2.column) > 1) return false;
    return true;
};
