import React from "react";
import { useSelector } from "react-redux";

import { areNeighboring, coordToString, ICoords } from "../../../@types/i-coords";
import { RootState } from "../../../state/store";
import "../styles.css";

export const MessageAction = ({ coords, color }: {
    color: string;
    coords: ICoords;
}) => {
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);

    // if a player does not exists yet, we cannot send any message
    if (!currentPlayer) return null;

    // if the player is too far, neither
    if (!areNeighboring(currentPlayer.coords, coords)) return null;

    // this is not an action that the player can perform on itself
    if (coordToString(currentPlayer.coords) === coordToString(coords)) return null;

    return <button
        className="cell-stats__button"
        style={{ backgroundColor: color }}
        onClick={() => {}}>
        Message
    </button>;
};
