import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { calculateWorth, IPlayer } from "../../../@types/i-player";
import { shortenAddress } from "../../../data/compact-address";
import { RootState } from "../../../state/store";

import "./styles.css";

export const Stats = () => {
    const { address } = useAccount();
    const currentPlayer = useSelector((state: RootState) => state.player.currentPlayer);

    if (!currentPlayer) return <div className="stats">Loading...</div>;

    return (
        <div className="stats">
            <PlayerPanel playerData={currentPlayer} />
        </div>
    );
};

const PlayerPanel = ({ playerData }: { playerData: IPlayer }) => {
    return (
        <div className="stats">
            <div className="stats__address">{shortenAddress(playerData.userAddress)}</div>
            <div className="stats__worth">{calculateWorth(playerData)} DVD</div>
            <div className="stats__balance">{playerData.balance} DVD</div>
            <div className="stats__claimable">{playerData.claimable} DVD</div>
            <div className="stats__sponsorships">{playerData.sponsorships} DVD</div>
        </div>
    );
};
