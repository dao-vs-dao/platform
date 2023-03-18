import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useProvider } from "wagmi";
import { retrieveGameState } from "../../components/shared";

import { fetchGameData, fetchPlayerData } from "../../data/dao-vs-dao-contract";
import { setGameData } from "../../state/slices/game-slice";
import { setCurrentPlayer } from "../../state/slices/player-slice";
import { Pyramid } from "./pyramid";
import "./styles.css";

export const Dashboard = () => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();

    useEffect(() => {
        retrieveGameState(dispatch, provider, address);
    }, [address]);

    return (
        <div className="dashboard">
            <Pyramid />
        </div>
    );
};
