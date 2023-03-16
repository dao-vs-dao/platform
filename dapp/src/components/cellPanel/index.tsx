import React from "react";
import { useDispatch } from "react-redux";
import { useAccount, useProvider, useSigner } from "wagmi";
import { ICoords } from "../../@types/i-coords";
import { calculateWorth, IPlayer } from "../../@types/i-player";
import { shortenAddress } from "../../data/compact-address";
import { claimTokens, fetchGameData, fetchPlayerData } from "../../data/data-fetcher";
import { setGameData } from "../../state/slices/game-slice";
import { setCurrentPlayer } from "../../state/slices/player-slice";
import { errorToast, promiseToast } from "../toaster";
import { Tooltip } from "../tooltip";
import "./styles.css";

interface ICellPanelProps {
    color: string;
    coords: ICoords;
    player?: IPlayer;
}

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
                <button className="cell-stats__button" style={{ backgroundColor: color }} disabled={true}>Swap</button>
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

    const retrieveGameState = async () => {
        const gameData = await fetchGameData(provider);
        dispatch(setGameData({ gameData }));
        console.log(gameData)

        const currentPlayer = address ? await fetchPlayerData(provider, address) : null;
        dispatch(setCurrentPlayer({ currentPlayer }));
        console.log(currentPlayer)
    };

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
            const promise = claimTokens(signer).then(() => retrieveGameState());
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
