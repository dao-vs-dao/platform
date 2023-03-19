import React, { useEffect, useState } from "react";
import { ICoords } from "../../@types/i-coords";

import { calculateWorth, IPlayer } from "../../@types/i-player";
import { shortenAddress } from "../../data/compact-address";
import { hasAttackCoolDown, hasRecoveryCoolDown, timeLeft } from "../../data/cooldowns";
import { Tooltip } from "../tooltip";
import { ClaimActions } from "./actions/claim-action";
import { MessageAction } from "./actions/message-action";
import { SponsorAction } from "./actions/sponsor-action";
import { SwapAction } from "./actions/swap-action";
import "./styles.css";

interface IPlayerCellPanelProps {
    color: string;
    coords: ICoords;
    player: IPlayer;
}

export const PlayerCellPanel = ({ player, color, coords }: IPlayerCellPanelProps) => {
    return (
        <div className="cell-stats">
            {/* Title */}
            <div className="cell-stats__title" style={{ color: color }}>
                {shortenAddress(player.userAddress)}
            </div>
            <div className="cell-stats__space" />

            {/* Player Worth */}
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

            {/* Status */}
            <PlayerStatus color={color} player={player} />

            {/* Actions */}
            <div className="cell-stats__line" style={{ borderColor: color }} />
            <div className="cell-stats__subtitle" style={{ color: color }}>Actions:</div>
            <div className="cell-stats__actions">
                <ClaimActions color={color} coords={coords} />
                <MessageAction color={color} coords={coords} />
                <SponsorAction color={color} coords={coords} />
                <SwapAction color={color} coords={coords} />
            </div>
        </div>
    );
};

const PlayerStatus = ({ player, color }: { player: IPlayer, color: string; }) =>
    hasRecoveryCoolDown(player) ? <PlayerStatusRecoveryCoolDown color={color} player={player} />
        : hasAttackCoolDown(player) ? <PlayerStatusAttackCoolDown color={color} player={player} />
            : null;

const PlayerStatusRecoveryCoolDown = ({ player, color }: { player: IPlayer, color: string; }) => {
    const [countdown, setCountdown] = useState<string>(timeLeft(player.recoveryCoolDownEndTimestamp));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(timeLeft(player.recoveryCoolDownEndTimestamp));
        }, 1000);

        return () => { clearInterval(intervalId); };
    }, []);

    return <>
        <div className="cell-stats__line" style={{ borderColor: color }} />
        <div className="cell-stats__row">
            <div className="cell-stats__subtitle" style={{ color: color }}>Status: recovery</div>
            <div className="cell-stats__countdown">{countdown}</div>
        </div>

        <div className="cell-stats__row">
            <div className="cell-stats__label">
                - Cannot be attacked
            </div>
        </div>
        <div className="cell-stats__row">
            <div className="cell-stats__label">
                - Status will be lost if player attacks
            </div>
        </div>
    </>;
};

const PlayerStatusAttackCoolDown = ({ player, color }: { player: IPlayer, color: string; }) => {
    const [countdown, setCountdown] = useState<string>(timeLeft(player.attackCoolDownEndTimestamp));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(timeLeft(player.attackCoolDownEndTimestamp));
        }, 1000);

        return () => { clearInterval(intervalId); };
    }, []);

    return <>
        <div className="cell-stats__line" style={{ borderColor: color }} />
        <div className="cell-stats__row">
            <div className="cell-stats__subtitle" style={{ color: color }}>Status: dormant</div>
            <div className="cell-stats__countdown">{countdown}</div>
        </div>

        <div className="cell-stats__row">
            <div className="cell-stats__label">- Cannot attack</div>
        </div>
        <div className="cell-stats__row">
            <div className="cell-stats__label">- 2x slashing penalty if attacked</div>
        </div>
    </>;
};
