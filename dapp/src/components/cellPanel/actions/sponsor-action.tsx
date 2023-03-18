import React from "react";
import { useSelector } from "react-redux";

import { coordToString, ICoords } from "../../../@types/i-coords";
import { RootState } from "../../../state/store";
import { Tooltip } from "../../tooltip";
import "../styles.css";

export const SponsorAction = ({ coords, color }: {
    color: string;
    coords: ICoords;
}) => {
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);

    // if a player does not exists yet, we cannot sponsor
    if (!currentPlayer) return null;

    // this is not an action that the player can perform on itself
    if (coordToString(currentPlayer.coords) === coordToString(coords)) return null;


    const disabled = currentPlayer.balance === 0;
    const message = !disabled ? "" : `You need some DVD to sponsor a player`;

    const button = <button
        className="cell-stats__button"
        style={{ backgroundColor: color }}
        disabled={disabled}
        onClick={() => { }}>
        Sponsor
    </button>;

    return disabled
        ? <Tooltip extraTooltipStyles={{ textAlign: "center" }} iconComponent={button}> {message} </Tooltip>
        : button;
};
