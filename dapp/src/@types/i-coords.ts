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
    const dR = Math.abs(c1.row - c2.row);
    const dC = Math.abs(c1.column - c2.column);
    return (
        (dR == 0 && dC == 1) || // vertically adjacent
        (dR == 1 && dC == 0) || // top right or bottom left
        (dR == 1 &&
            dC == 1 &&
            ((c1.row > c2.row && c1.column > c2.column) || // top left
                (c1.row < c2.row && c1.column < c2.column))) // bottom right
    );
};

/**
 * Check whether a player in the first set of coordinate can swap
 * with a player in the second set.
 */
export const canSwap = (c1: ICoords, c2: ICoords) => {
    if (!areNeighboring(c1, c2)) return false;
    if (c1.row < c2.row) return false;
    return true;
};
