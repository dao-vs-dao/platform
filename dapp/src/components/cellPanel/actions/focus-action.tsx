import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { coordToString, ICoords } from "../../../@types/i-coords";
import { IPlayer } from "../../../@types/i-player";
import { setFocus } from "../../../state/slices/game-slice";
import { RootState } from "../../../state/store";
import "../styles.css";

export const FocusAction = ({ coords, color }: {
    color: string;
    coords: ICoords;
}) => {
    const dispatch = useDispatch();
    const focus = useSelector((state: RootState) => state.game.focus);
    const game = useSelector((state: RootState) => state.game.gameData);
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);

    // focus is disabled until there are enough players to make it useful
    if (!game || game.players.length < 20) return null;

    // if the focus is already here, we won't show the button
    if (focus && coordToString(focus) === coordToString(coords)) return null;

    // we won't show the button on the current player, if the focus is there
    if (currentPlayer) {
        const currentFocus = focus ?? currentPlayer.coords;
        const cellIsCurrentPlayer = coordToString(currentPlayer.coords) === coordToString(coords);
        const focusIsHere = coordToString(currentFocus) === coordToString(coords);
        if (cellIsCurrentPlayer && focusIsHere) return null;
    }

    // set focus to undefined if it is targeting the current player
    const focusTarget = currentPlayer && coordToString(currentPlayer.coords) === coordToString(coords)
        ? undefined
        : coords;

    const button = <button
        className="cell-stats__button"
        style={{ backgroundColor: color }}
        onClick={() => {
            dispatch(setFocus({ focus: focusTarget }));
        }}>
        Focus
    </button>;

    return button;
};
