import React, { useState } from "react";
import { useSelector } from "react-redux";
import { coordsFromLooseValues, ICoords, pyramidDistance } from "../../../@types/i-coords";
import { zeroAddress } from "../../../data/utils";

import { RootState } from "../../../state/store";
import { Cell } from "./cell";
import "./pyramid.css";

const MAX_DISTANCE_FROM_FOCUS = 320;

export const Pyramid = () => {
    const gameData = useSelector((state: RootState) => state.game.gameData);
    const [realm, setRealm] = useState<number>(0);
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);

    const getCellPosition = (focusPoint: ICoords, coord: ICoords): { top: number, left: number; } => {
        const row = coord.row - focusPoint.row;
        const column = coord.column - focusPoint.column;

        const top = row * 53;
        const rowDisplacement = row * 43;
        const columnDisplacement = column * 87;
        const left = columnDisplacement - rowDisplacement;
        return { top, left };
    };

    if (!gameData || currentPlayer === undefined) return <div className="pyramid">Loading...</div>;

    /**
     * As it is not possible to print the whole pyramid, we need to have a focus
     * point and print the portion around it.
     *
     * If we have a player -> The player coordinates are the focus
     * If we do not -> the first empty cell is the focus
     */
    const getFirstEmptyCell = () => {
        for (var r = 0; r < gameData.lands[realm].length; r++)
            for (var c = 0; c < gameData.lands[realm][r].length; c++)
                if (gameData.lands[realm][r][c] === zeroAddress)
                    return coordsFromLooseValues(realm, r, c);

        const lastRow = gameData.lands[realm].length - 1;
        const lastCell = gameData.lands[realm][lastRow].length - 1;
        return coordsFromLooseValues(realm, lastRow, lastCell);
    };

    let focusPoint = currentPlayer ? currentPlayer.coords : getFirstEmptyCell();
    const flattenedCoordinates = gameData.lands[realm].map((addresses, row) =>
        addresses.map((_, column) => coordsFromLooseValues(realm, row, column)))
        .flat();

    const cellsToRender = flattenedCoordinates
        .filter(coord => pyramidDistance(focusPoint, coord) <= MAX_DISTANCE_FROM_FOCUS);

    const precalculateCoordinates = cellsToRender.map(c => getCellPosition(focusPoint, c));
    const minTop = precalculateCoordinates.reduce((prev, curr) => prev > curr.top ? curr.top : prev, 999999);

    return <div className="pyramid">
        <div className="pyramid__cells" style={{ top: `${-minTop}px` }}>
            {cellsToRender.map((coord) => <Cell
                position={getCellPosition(focusPoint, coord)}
                key={`cell-${realm}-${coord.row}-${coord.column}`}
                coords={coord}
                distance={pyramidDistance(focusPoint, coord)}
            />)}
        </div>
    </div>;
};
