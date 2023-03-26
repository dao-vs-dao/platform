import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { areNeighboring, coordToString, ICoords } from "../../../@types/i-coords";
import { IPlayer } from "../../../@types/i-player";
import { openMessagingModal, pushMessages } from "../../../state/slices/messaging-slice";
import { RootState } from "../../../state/store";
import "../styles.css";

export const MessageAction = ({ coords, color }: {
    color: string;
    coords: ICoords;
}) => {
    const dispatch = useDispatch();
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const playersFromCoords = useSelector((state: RootState) => state.game.playersByCoords);
    const playerOnCell: IPlayer | undefined = playersFromCoords[coordToString(coords)];

    // if a player does not exists yet, we cannot send any message
    if (!currentPlayer) return null;

    // if there is no player in the cell, we cannot send messages
    if (!playerOnCell) return null;

    // if the player is too far, neither
    if (!areNeighboring(currentPlayer.coords, coords)) return null;

    // this is not an action that the player can perform on itself
    if (playerOnCell.userAddress === currentPlayer.userAddress) return null;

    return <button
        className="cell-stats__button"
        style={{ backgroundColor: color }}
        onClick={() => dispatch(openMessagingModal({ otherPlayer: playerOnCell.userAddress }))}>
        Message
    </button>;
};
