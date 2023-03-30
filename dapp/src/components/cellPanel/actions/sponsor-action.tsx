import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAccount, useProvider, useSigner } from "wagmi";

import { coordToString, ICoords } from "../../../@types/i-coords";
import { IPlayer } from "../../../@types/i-player";
import { openInitiationModal } from "../../../state/slices/sponsoring-slice";
import { RootState } from "../../../state/store";
import { Tooltip } from "../../tooltip";
import "../styles.css";

export const SponsorAction = ({ coords, color }: {
    color: string;
    coords: ICoords;
}) => {
    const dispatch = useDispatch();
    const playersFromCoords = useSelector((state: RootState) => state.game.playersByCoords);
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const playerOnCell: IPlayer | undefined = playersFromCoords[coordToString(coords)];

    // if a player does not exists yet, or on this cell, we cannot sponsor
    if (!currentPlayer || !playerOnCell) return null;

    // this is not an action that the player can perform on itself
    if (coordToString(currentPlayer.coords) === coordToString(coords)) return null;

    const disabled = currentPlayer.balance === 0;
    const message = !disabled ? "" : `You need some DVD to sponsor a player`;

    const button = <button
        className="cell-stats__button"
        style={{ backgroundColor: color }}
        disabled={disabled}
        onClick={() => {
            dispatch(openInitiationModal({ otherPlayer: playerOnCell.userAddress }));
        }}>
        Sponsor
    </button>;

    return disabled
        ? <Tooltip extraTooltipStyles={{ textAlign: "center" }} iconComponent={button}> {message} </Tooltip>
        : button;
};
