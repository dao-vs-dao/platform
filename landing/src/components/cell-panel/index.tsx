import React from "react";
import { getWorth, IPlayer, roundAtFifthDecimal, shortenAddress } from "../../@types/i-player";
import { Tooltip } from "../tooltip";

import "./styles.css";

interface IPlayerCellPanelProps {
    color: string;
    player: IPlayer;
}

export const PlayerCellPanel = ({
    color,
    player,
}: IPlayerCellPanelProps) => {
    return (
        <div className={`cell-panel`} style={{ borderColor: color }}>

            <div className="cell-stats">
                {/* Title */}
                <div className="cell-stats__title" style={{ color: color }}>
                    {shortenAddress(player.address)}
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
                    <div className="cell-stats__value">{getWorth(player)} DVD</div>
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
                    <button className="cell-stats__button" style={{ backgroundColor: color }}> Message </button>
                    <button className="cell-stats__button" style={{ backgroundColor: color }}> Sponsor </button>
                    <button className="cell-stats__button" style={{ backgroundColor: color }}> Swap </button>
                </div>
            </div>
        </div>
    );
};
