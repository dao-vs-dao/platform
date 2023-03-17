import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useProvider } from "wagmi";

import { fetchGameData, fetchPlayerData } from "../../data/dao-vs-dao-contract";
import { setGameData } from "../../state/slices/game-slice";
import { setCurrentPlayer } from "../../state/slices/player-slice";
import { Pyramid } from "./pyramid";
import "./styles.css";

export const Dashboard = () => {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const provider = useProvider();

    const retrieveGameState = async () => {
        const gameData = await fetchGameData(provider);
        dispatch(setGameData({ gameData }));

        const currentPlayer = address ? await fetchPlayerData(provider, address) : null;
        dispatch(setCurrentPlayer({ currentPlayer }));
    };

    useEffect(() => {
        retrieveGameState();
    }, [address]);

    return (
        <div className="dashboard">
            <Pyramid />
        </div>
    );
};
