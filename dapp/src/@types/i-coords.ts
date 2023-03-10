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
