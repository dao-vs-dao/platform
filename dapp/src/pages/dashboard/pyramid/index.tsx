import React, { useState } from "react";
import { useSelector } from "react-redux";
import { coordsFromLooseValues, coordToString, looseCoordToString } from "../../../@types/i-coords";

import { RootState } from "../../../state/store";
import { Cell } from "./cell";
import "./pyramid.css";

export const Pyramid = () => {
    const gameData = useSelector((state: RootState) => state.game.gameData);
    const [realm, setRealm] = useState<number>(0);

    const composeRow = (addresses: string[], row: number) => (
        <div
            className={`pyramid__row ${row > 0 ? "pyramid__row--push-up" : ""}`}
            key={`row-${row}`}
        >
            {addresses.map((_, column) => {
                return (
                    <Cell
                        key={`cell-${realm}-${row}-${column}`}
                        coords={coordsFromLooseValues(realm, row, column)}
                    />
                );
            })}
        </div>
    );

    if (!gameData) return <div className="pyramid">Loading...</div>;
    return <div className="pyramid">{gameData.lands[realm].map(composeRow)}</div>;
};
