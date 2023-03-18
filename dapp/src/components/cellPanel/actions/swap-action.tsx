import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAccount, useProvider, useSigner } from "wagmi";

import { canSwap, coordToString, ICoords } from "../../../@types/i-coords";
import { calculateWorth, roundAtFifthDecimal } from "../../../@types/i-player";
import { swap } from "../../../data/dao-vs-dao-contract";
import { RootState } from "../../../state/store";
import { retrieveGameState } from "../../shared";
import { errorToast, promiseToast } from "../../toaster";
import { Tooltip } from "../../tooltip";
import "../styles.css";

export const SwapAction = ({ coords, color }: {
    color: string;
    coords: ICoords;
}) => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();
    const { data: signer, isError: isSignerError } = useSigner();
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const playersFromCoords = useSelector((state: RootState) => state.game.playersByCoords);

    const swapWithSelected = async () => {
        if (!address) {
            errorToast("We cannot get the address of your wallet");
            return;
        }
        if (!signer || isSignerError) {
            errorToast("We cannot get a signer from your wallet. Contact us if it keeps happening");
            return;
        }

        try {
            const promise = swap(signer, coords).then(() => retrieveGameState(dispatch, provider, address));
            await promiseToast(
                promise,
                "Swapping ⚔️⚔️",
                `Swap successful!`,
                "Something strange happened. Contact us if the error persists"
            );;
        } catch (error) {
            // user is informed via an error toast when the promise fails
            console.log(error);
            return;
        }
    };


    // if a player does not exists yet, we cannot swap
    if (!currentPlayer) return null;

    // if the player is too far, neither
    if (!canSwap(currentPlayer.coords, coords)) return null;

    // this is not an action that the player can perform on itself
    if (coordToString(currentPlayer.coords) === coordToString(coords)) return null;

    const playerOnCell = playersFromCoords[coordToString(coords)];
    const cellWorth = playerOnCell ? calculateWorth(playerOnCell) : 0;
    const playerWorth = calculateWorth(currentPlayer);
    const hasEnoughWorth = playerWorth >= cellWorth * 1.2;

    const disabled = !hasEnoughWorth;
    const message = !disabled
        ? ""
        : !hasEnoughWorth
            ? `Your worth isn't enough to swap with this player
            (need at least ${roundAtFifthDecimal(cellWorth * 1.2)} DVD)`
            : "🤷";

    const button = <button
        className="cell-stats__button"
        style={{ backgroundColor: color }}
        disabled={disabled}
        onClick={swapWithSelected}>
        Swap
    </button>;

    return disabled
        ? <Tooltip extraTooltipStyles={{ textAlign: "center" }} iconComponent={button}> {message} </Tooltip>
        : button;
};
