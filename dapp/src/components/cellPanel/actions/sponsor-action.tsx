import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAccount, useProvider, useSigner } from "wagmi";

import { coordToString, ICoords } from "../../../@types/i-coords";
import { IPlayer } from "../../../@types/i-player";
import { sponsor } from "../../../data/dao-vs-dao-contract";
import { setSelectedCoords } from "../../../state/slices/player-slice";
import { RootState } from "../../../state/store";
import { retrieveGameState } from "../../shared";
import { errorToast, promiseToast } from "../../toaster";
import { Tooltip } from "../../tooltip";
import "../styles.css";

export const SponsorAction = ({ coords, color }: {
    color: string;
    coords: ICoords;
}) => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();
    const { data: signer, isError: isSignerError } = useSigner();
    const playersFromCoords = useSelector((state: RootState) => state.game.playersByCoords);
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const playerOnCell: IPlayer | undefined = playersFromCoords[coordToString(coords)];

    const triggerSponsoring = async () => {
        if (!address) {
            errorToast("We cannot get the address of your wallet");
            return;
        }
        if (!signer || isSignerError) {
            errorToast("We cannot get a signer from your wallet. Contact us if it keeps happening");
            return;
        }

        try {
            const amount = 0.001;
            const otherPlayerAddress = playerOnCell!.userAddress;
            const promise = sponsor(signer, otherPlayerAddress, amount)
                .then(() => retrieveGameState(dispatch, provider, address));
            await promiseToast(
                promise,
                "Creating sponsorship contract...",
                "Sponsoring successful!",
                "Something strange happened. Contact us if the error persists"
            );;
        } catch (error) {
            // user is informed via an error toast when the promise fails
            console.log(error);
            return;
        }
    };

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
            dispatch(setSelectedCoords({ coords: undefined }));
            triggerSponsoring();
        }}>
        Sponsor
    </button>;

    return disabled
        ? <Tooltip extraTooltipStyles={{ textAlign: "center" }} iconComponent={button}> {message} </Tooltip>
        : button;
};
