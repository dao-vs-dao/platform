import { AnyAction } from "@reduxjs/toolkit";
import { providers } from "ethers";
import React, { Dispatch } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useAccount, useProvider, useSigner } from "wagmi";
import { ICoords } from "../../@types/i-coords";
import { calculateWorth, IPlayer } from "../../@types/i-player";
import { shortenAddress } from "../../data/compact-address";
import { claimTokens, fetchGameData, fetchParticipationFee, fetchPlayerData, placeUser } from "../../data/dao-vs-dao-contract";
import { setGameData } from "../../state/slices/game-slice";
import { setCurrentPlayer } from "../../state/slices/player-slice";
import { RootState } from "../../state/store";
import { errorToast, promiseToast } from "../toaster";
import { Tooltip } from "../tooltip";
import "./styles.css";

interface ICellPanelProps {
    color: string;
    coords: ICoords;
    player?: IPlayer;
}

const retrieveGameState = async (dispatch: Dispatch<AnyAction>, provider: providers.Provider, address: string) => {
    const gameData = await fetchGameData(provider);
    dispatch(setGameData({ gameData }));
    console.log(gameData);

    const currentPlayer = address ? await fetchPlayerData(provider, address) : null;
    dispatch(setCurrentPlayer({ currentPlayer }));
    console.log(currentPlayer);
};

export const CellPanel = ({ color, coords, player }: ICellPanelProps) => {
    return (
        <div className={`cell-panel`} style={{ borderColor: color }}>
            {
                player
                    ? <PlayerPanel player={player} color={color} />
                    : <EmptyCellPanel color={color} coords={coords} />
            }
        </div>
    );
};

const EmptyCellPanel = ({ coords, color }: { coords: ICoords; color: string; }) => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);
    const { address } = useAccount();
    const provider = useProvider();
    const { data: signer, isError: isSignerError } = useSigner();

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

    return (
        <div className="cell-stats">
            {/* Title */}
            <div className="cell-stats__title" style={{ color: color }}>
                Empty Area [{coords.row}, {coords.column}]
            </div>

            {/* Actions */}
            <div className="cell-stats__line" style={{ borderColor: color }} />
            <div className="cell-stats__subtitle" style={{ color: color }}>Actions:</div>
            <div className="cell-stats__actions">
                {currentPlayer
                    ? <button className="cell-stats__button" style={{ backgroundColor: color }} disabled={true}>Swap</button>
                    : <button className="cell-stats__button" style={{ backgroundColor: color }} onClick={startGameHere}>Start Here!</button>
                }
            </div>
        </div>
    );
};

const PlayerPanel = ({ player, color }: { player: IPlayer; color: string; }) => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();
    const { data: signer, isError: isSignerError } = useSigner();
    const isLocalPlayerCell = player.userAddress === address;

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

    return (
        <div className="cell-stats">
            {/* Title & Worth */}
            <div className="cell-stats__title" style={{ color: color }}>
                {shortenAddress(player.userAddress)}
            </div>
            <div className="cell-stats__row">
                <div className="cell-stats__label">
                    <Tooltip iconComponent={<div className="cell-stats__tooltip-label">Worth</div>}>
                        A player worth is the sum of their DVD balance,
                        sponsorships and claimable tokens.
                        <br /><br />
                        You can swap another player when your worth is
                        at least 120% of the other player. By swapping,
                        you will steal 20% of their DVD tokens.
                    </Tooltip>
                </div>
                <div className="cell-stats__value">{calculateWorth(player)} DVD</div>
            </div>

            {/* Worth Breakdown */}
            <div className="cell-stats__line" style={{ borderColor: color }} />
            <div className="cell-stats__subtitle" style={{ color: color }}>Breakdown:</div>
            <div className="cell-stats__row">
                <div className="cell-stats__label">
                    <Tooltip iconComponent={<div className="cell-stats__tooltip-label">Balance</div>}>
                        The amount of DVD owned by a player.
                        <br /><br />
                        A player can use their balance to sponsor other players,
                        or transfer it, as any other ERC20.
                    </Tooltip>
                </div>
                <div className="cell-stats__value">{player.balance} DVD</div>
            </div>
            <div className="cell-stats__row">
                <div className="cell-stats__label">
                    <Tooltip iconComponent={<div className="cell-stats__tooltip-label">Sponsorships</div>}>
                        The amount other players gave to this user as
                        a temporary sponsorship.
                        <br /><br />
                        By sponsoring another player, you earn when they
                        swap with another user, and loose when they are
                        the target of a swap.
                        <br /><br />
                        You can un-sponsor a player anytime.
                    </Tooltip>
                </div>
                <div className="cell-stats__value">{player.sponsorships} DVD</div>
            </div>
            <div className="cell-stats__row">
                <div className="cell-stats__label">
                    <Tooltip iconComponent={<div className="cell-stats__tooltip-label">Claimable</div>}>
                        The amount of accrued DVD that can be moved
                        to the balance.
                        <br /><br />
                        The amount of earned DVD depends on how high
                        you are in the hierarchy. Also, if another row is
                        added, <strong>your earnings will automatically
                            increase retroactively</strong>.
                    </Tooltip>
                </div>
                <div className="cell-stats__value">{player.claimable} DVD</div>
            </div>

            {/* Actions */}
            <div className="cell-stats__line" style={{ borderColor: color }} />
            <div className="cell-stats__subtitle" style={{ color: color }}>Actions:</div>
            <div className="cell-stats__actions">
                {isLocalPlayerCell
                    ? <button onClick={claim} className="cell-stats__button" style={{ backgroundColor: color }} disabled={player.claimable === 0}>Claim</button>
                    : <>
                        <button className="cell-stats__button" style={{ backgroundColor: color }} disabled={true}>Message</button>
                        <button className="cell-stats__button" style={{ backgroundColor: color }} disabled={true}>Sponsor</button>
                        <button className="cell-stats__button" style={{ backgroundColor: color }} disabled={true}>Swap</button>
                    </>
                }
            </div>
        </div>
    );
};
