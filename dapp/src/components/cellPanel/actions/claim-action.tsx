import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAccount, useProvider, useSigner } from "wagmi";

import { coordToString, ICoords } from "../../../@types/i-coords";
import { claimTokens } from "../../../data/dao-vs-dao-contract";
import { RootState } from "../../../state/store";
import { retrieveGameState } from "../../shared";
import { errorToast, promiseToast } from "../../toaster";
import { Tooltip } from "../../tooltip";
import "../styles.css";

export const ClaimActions = ({ coords, color }: {
    color: string;
    coords: ICoords;
}) => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();
    const { data: signer, isError: isSignerError } = useSigner();
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);

    const claim = async () => {
        if (!address) {
            errorToast("We cannot get the address of your wallet");
            return;
        }
        if (!signer || isSignerError) {
            errorToast("We cannot get a signer from your wallet. Contact us if it keeps happening");
            return;
        }

        try {
            const promise = claimTokens(signer).then(() => retrieveGameState(dispatch, provider, address));
            await promiseToast(
                promise,
                "Claiming your tokens...",
                "Tokens have been claimed!",
                "Something strange happened. Contact us if the error persists"
            );;
        } catch (error) {
            // user is informed via an error toast when the promise fails
            console.log(error);
            return;
        }
    };

    // if a player does not exists yet, we cannot claim
    if (!currentPlayer) return null;

    // if this is not the player's area, neither
    if (coordToString(currentPlayer.coords) !== coordToString(coords)) return null;

    const disabled = currentPlayer.claimable === 0;
    const message = !disabled ? "" : `Nothing to claim`;

    const button = <button
        className="cell-stats__button"
        style={{ backgroundColor: color }}
        disabled={disabled}
        onClick={claim}>
        Claim
    </button>;

    return disabled
        ? <Tooltip extraTooltipStyles={{ textAlign: "center" }} iconComponent={button}> {message} </Tooltip>
        : button;
};
