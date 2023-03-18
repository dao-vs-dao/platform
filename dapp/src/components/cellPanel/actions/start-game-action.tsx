import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useAccount, useProvider, useSigner } from "wagmi";

import { ICoords } from "../../../@types/i-coords";
import { fetchParticipationFee, placeUser } from "../../../data/dao-vs-dao-contract";
import { RootState } from "../../../state/store";
import { retrieveGameState } from "../../shared";
import { errorToast, promiseToast } from "../../toaster";
import "../styles.css";

export const StartGameAction = ({ coords, color }: {
    color: string;
    coords: ICoords;
}) => {
    const dispatch = useDispatch();
    const provider = useProvider();
    const { address } = useAccount();
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: signer, isError: isSignerError } = useSigner();
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);

    const isValidEthereumAddress = (address: string | null): boolean => {
        const addressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        return !!address && addressRegex.test(address);
    };

    const startGameHere = async () => {
        if (!address) {
            errorToast("We cannot get the address of your wallet");
            return;
        }
        if (!signer || isSignerError) {
            errorToast("We cannot get a signer from your wallet. Contact us if it keeps happening");
            return;
        }

        try {
            let referrer = searchParams.get("referral");
            referrer = isValidEthereumAddress(referrer) ? referrer : null;

            const promise = placeUser(signer, coords, referrer ?? undefined)
                .then(() => retrieveGameState(dispatch, provider, address));

            await promiseToast(
                promise,
                `Teleporting you to [${coords.row},${coords.column}]`,
                "You are now a player of Dao Vs Dao!"
            );
            setSearchParams("");
        } catch (error) {
            if (JSON.stringify(error).includes("insufficient funds for gas")) {
                // user doesn't have enough funds
                const participationFee = await fetchParticipationFee(provider);
                errorToast(`Not enough funds!! You need at least ${participationFee} MATIC to participate`);
                return;
            }

            errorToast(`Something strange happened... Check the console for more details`);
            console.log(error);
            return;
        }
    };

    // if a player exists, we cannot position it.
    if (currentPlayer) return null;

    return <button
        className="cell-stats__button"
        style={{ backgroundColor: color }}
        onClick={startGameHere}>
        Start Here!
    </button>;
};
